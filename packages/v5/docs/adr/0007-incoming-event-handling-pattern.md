---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0007: Incoming Event Handling Pattern

## Context and Problem Statement

The system receives events from external services and from its own event store (via relays and subscriptions). These incoming events can serve two distinct purposes: triggering a domain decision (via a command) or updating a read model (via a projector). We need a consistent pattern for how incoming events are received, classified, and routed to the right handler without coupling the domain to the event's origin or transport.

## Decision Drivers

- Incoming events are just another inbound trigger — the domain does not care whether a command came from HTTP or was triggered by an event
- The distinction between "this event should trigger a decision" and "this event should update a projection" must be explicit and consistent
- Inbound event adapters must translate external event schemas into internal domain concepts — the domain must not be shaped by external schemas
- Technical events must be captured at the inbound boundary
- Event handlers must not contain domain logic

## Considered Options

1. Event handlers directly mutate state without going through the decider
2. Event handlers always translate to commands and go through the full command lifecycle
3. Event handlers route to either a command handler or a projector based on event type
4. A single event bus internally dispatches all events to all interested handlers

## Decision Outcome

Chosen option 3: **Event handlers route to either a command handler or a projector based on event type**, because it makes the purpose of each incoming event explicit, preserves the command handling pattern for state-changing decisions, and keeps projection updates on the query side where they belong.

### Consequences

* Good, because the domain is completely isolated from external event schemas — external services can change their schemas without affecting domain logic
* Good, because the routing path for each incoming event is explicit and discoverable in the inbound adapter
* Good, because events that trigger decisions benefit from the full command lifecycle — consistent handling, rejection notification, technical events
* Good, because events that only update projections bypass the command side entirely — no accidental state changes
* Good, because idempotency is handled consistently at the command level
* Bad, because every incoming event type requires an explicit translation function in the inbound adapter — more code per event type, but each function is small and focused
* Bad, because the routing decision in the adapter is a form of coupling between the adapter and the domain's internal structure — acceptable because the adapter is explicitly a boundary concern
* Bad, because developers may route projection-only events through the command handler for convenience — this is incorrect and must be caught in code review
* Bad, because external schema changes may break translation functions silently — write translation tests that assert the mapping for known external event payloads
* Bad, because duplicate event delivery can cause unexpected rejections — ensure `AlreadyProcessed` rejections are handled gracefully and recorded as technical events rather than failures

### Confirmation

Compliance is confirmed by code review: inbound event adapters never pass external schema types to command handlers or projectors; the routing decision (command vs projector) is explicit in the adapter code; translation functions have tests asserting known external payloads map correctly to internal types.

## Two Routing Paths

Every incoming event takes one of two paths:

```
incoming event
  → inbound event adapter
      → translate external schema → internal event type
      │
      ├── triggers a decision?
      │     → translate to Command
      │     → call command handler (full command lifecycle per ADR-0005)
      │
      └── updates a read model only?
            → feed directly to projector
            → projector applies event to projection
```

The inbound event adapter makes the routing decision. It knows which events trigger commands and which update projections. This is explicit configuration — not dynamic dispatch.

## Inbound Event Adapter

The inbound event adapter is responsible for receiving external events, translating their schemas, and routing to the correct handler:

```rust
// use_cases/approve_time_entry/inbound/sqs.rs

pub struct ApproveTimeEntrySqsAdapter {
    command_handler: Arc<ApproveTimeEntryHandler>,
    technical_store: Arc<dyn TechnicalEventStore>,
}

impl ApproveTimeEntrySqsAdapter {
    pub async fn handle(&self, message: SqsMessage) {
        self.technical_store.write(TechnicalEvent::SqsMessageReceived {
            queue: message.queue_url.clone(),
            message_id: message.message_id.clone(),
            timestamp: Utc::now(),
        }).await;

        let command = match self.translate(&message) {
            Ok(cmd) => cmd,
            Err(e) => {
                self.technical_store.write(TechnicalEvent::ValidationFailed {
                    reason: e.to_string(),
                    trace_id: extract_trace_id(&message),
                    timestamp: Utc::now(),
                }).await;
                return; // ack and move on — rejection notification travels via outbox
            }
        };

        // full command lifecycle — same as HTTP inbound adapter
        match self.command_handler.handle(command).await {
            Ok(_) => {
                self.technical_store.write(TechnicalEvent::SqsMessageHandled {
                    message_id: message.message_id,
                    timestamp: Utc::now(),
                }).await;
            }
            Err(e) => {
                self.technical_store.write(TechnicalEvent::OutboundAdapterFailed {
                    adapter: "ApproveTimeEntryHandler".to_string(),
                    reason: e.to_string(),
                    timestamp: Utc::now(),
                }).await;
            }
        }
    }

    fn translate(&self, message: &SqsMessage) -> Result<ApproveTimeEntry, TranslationError> {
        let dto: ApproveTimeEntryMessage = serde_json::from_str(message.body.as_deref().unwrap_or(""))
            .map_err(|e| TranslationError::DeserializationFailed(e.to_string()))?;

        Ok(ApproveTimeEntry {
            entry_id: dto.entry_id,
            approved_by: dto.approved_by,
            trace_id: dto.trace_id,
        })
    }
}
```

For events that only update a read model, the adapter feeds directly to the projector:

```rust
// adapters/inbound/eventbridge/time_entry_external_events.rs

pub struct TimeEntryExternalEventAdapter {
    projector: Arc<ListTimeEntriesProjector>,
    technical_store: Arc<dyn TechnicalEventStore>,
}

impl TimeEntryExternalEventAdapter {
    pub async fn handle(&self, event: EventBridgeEvent) {
        self.technical_store.write(TechnicalEvent::EventBridgeEventReceived {
            source: event.source.clone(),
            detail_type: event.detail_type.clone(),
            timestamp: Utc::now(),
        }).await;

        let domain_event = match self.translate(&event) {
            Ok(e) => e,
            Err(e) => {
                self.technical_store.write(TechnicalEvent::ValidationFailed {
                    reason: e.to_string(),
                    trace_id: TraceId::default(),
                    timestamp: Utc::now(),
                }).await;
                return;
            }
        };

        // no command handler — directly updates projection
        self.projector.apply(domain_event).await;
    }

    fn translate(&self, event: &EventBridgeEvent) -> Result<TimeEntryEvent, TranslationError> {
        // translate external event schema to internal domain event
        match event.detail_type.as_str() {
            "TimeEntryExternallyUpdated" => {
                let dto: ExternalTimeEntryUpdatedDto = serde_json::from_value(event.detail.clone())
                    .map_err(|e| TranslationError::DeserializationFailed(e.to_string()))?;
                Ok(TimeEntryEvent::ExternallyUpdated { id: dto.id, .. })
            }
            unknown => Err(TranslationError::UnknownEventType(unknown.to_string())),
        }
    }
}
```

## Schema Translation

External events arrive in schemas defined by other services. The inbound event adapter is the only place that knows about external schemas. The domain never sees them. Translation produces an internal domain type — either a Command or a domain Event — before anything else happens:

```
external event schema (owned by source service)
  → inbound adapter translates
  → internal Command or internal Event (owned by this service)
  → command handler or projector
```

If the external schema changes, only the inbound adapter changes. Domain logic, command handlers, and projectors are unaffected.

## Idempotency

Incoming events may be delivered more than once (at-least-once delivery from message queues, Kafka, internal channels). Command handlers must be idempotent:

- If the event store already contains the events that would result from a command, the decider should return a rejection with `RejectionReason::AlreadyProcessed` — this is not an error, it is expected
- The inbound adapter should not retry on rejection — it should ack and move on
- A unique event or message ID should be carried through the command as a deduplication key where available

## Event Handler vs Command Handler

Incoming events that trigger decisions go through the full command handler lifecycle defined in ADR-0005 — there is no shortcut. The event is translated to a command, and the command handler handles it. This means:

- State is always reconstructed before deciding
- The decider always makes the judgment
- Technical events are always written
- Rejection notification always goes through the outbox

The fact that the trigger was an event rather than an HTTP request is invisible to the command handler.

## Inbound Transport Sources

Common inbound trigger types and their corresponding adapter locations:

| Transport | Adapter Location | Routing Path |
|---|---|---|
| HTTP (Axum) | `inbound/http.rs` | → command handler |
| Message queue (RabbitMQ, NATS, Redis Streams) | `inbound/queue.rs` | → command handler |
| Internal channel (`tokio::mpsc`) | `inbound/channel.rs` | → command handler or projector |
| Scheduled tick (`tokio::time::interval`) | `inbound/ticker.rs` | → projector |

The shell entry point for each use case determines which transport is wired to which inbound adapter.

## Rules

1. Inbound event adapters always translate external schemas to internal types before routing — no external schema leaks past the adapter
2. Events that trigger decisions are always translated to commands and handled via the full command lifecycle — no shortcuts
3. Events that only update projections are fed directly to the projector — they never touch the command side
4. The routing decision (command vs projector) is made explicitly in the adapter — not dynamically dispatched
5. Idempotency is handled at the command level — duplicate events result in a non-error rejection, not a crash
6. Technical events are written at the inbound boundary for every incoming event regardless of routing path
