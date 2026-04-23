---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0009: Event Relay Pattern

## Context and Problem Statement

Domain events are stored in the event store as the source of truth for internal state. External services that need to observe what happened in this bounded context must not read the domain event store directly — that would couple them to an internal schema. We need a relay that tails the domain event store, translates domain events into versioned integration events, and broadcasts them to external consumers in a controlled, ordered, and schema-stable way.

## Decision Drivers

- External services must never depend on the internal domain event schema
- Integration event schemas are external contracts — they must be versioned and stable
- Domain events must be delivered in order per aggregate to preserve causality
- The relay must not lose events — at-least-once delivery with a durable checkpoint
- Translation from domain event to integration event belongs entirely in the relay
- The relay must be independently deployable and observable via technical events
- Fan-out to multiple consumers must not require multiple relay implementations

## Considered Options

1. External services read directly from the domain event store
2. Command handler publishes integration events inline after persisting domain events
3. A single relay tails the event store and publishes to a topic per domain event type
4. A relay tails the event store, translates to integration events, publishes to a bounded context topic with event type as a header — consumers filter

## Decision Outcome

Chosen option 4: **Relay tails the event store, translates to integration events, publishes to a bounded context topic with event type as a header**, because it decouples internal domain schemas from external contracts, preserves ordering per aggregate, supports multiple consumers without relay proliferation, and keeps the integration contract in one place.

### Consequences

* Good, because external services are fully decoupled from internal domain event schemas — the domain can evolve freely without breaking consumers
* Good, because ordering per aggregate is guaranteed via Kafka partition key — consumers that process one aggregate at a time see events in causal order
* Good, because schema versioning with parallel publishing allows consumers to migrate at their own pace
* Good, because one topic per module keeps infrastructure manageable while supporting multiple consumer types via header filtering
* Good, because the checkpoint ensures no events are lost across restarts or failures
* Good, because technical events provide full observability of relay health — throughput, lag, failure rates
* Bad, because parallel publishing during schema migration doubles the publish load for that event type — acceptable for migration windows, which should be short
* Bad, because the translation function in the relay grows as event types grow — mitigated by keeping each match arm thin and delegating to typed builder functions
* Bad, because checkpoint management adds operational complexity — the checkpoint table must be backed up and recoverable
* Bad, because consumers not handling unknown fields in additive changes can break — enforce lenient deserialisation as a consumer contract requirement
* Bad, because advancing the checkpoint before Kafka acknowledgement in an implementation error would cause lost events — enforce in code review; this ADR serves that purpose
* Bad, because event relay falling behind under high write load may go unnoticed — monitor consumer lag and checkpoint position lag; scale by running multiple process instances if needed
* Bad, because dead lettered events in the relay may go unnoticed — set up alerting on the dead letter store depth from day one

### Confirmation

Compliance is confirmed by verifying no external service accesses the domain event store directly; integration event types carry a version suffix (`V1`, `V2`); the checkpoint is advanced only after Kafka `ack`; alerting exists on the event relay dead letter store.

## Domain Event vs Integration Event

A domain event is an internal fact shaped for the needs of the application. An integration event is an external fact shaped for the needs of consumers. They are deliberately separate:

```rust
// core/events.rs — internal, free to evolve
pub enum TimeEntryEvent {
    Created(TimeEntryCreated),
    Approved(TimeEntryApproved),
    Deleted(TimeEntryDeleted),
}

pub struct TimeEntryCreated {
    pub id: TimeEntryId,
    pub user_id: UserId,
    pub start: DateTime<Utc>,
    pub end: DateTime<Utc>,
    pub position: EventPosition,   // internal store position
}
```

```rust
// adapters/outbound/event_relay/integration_events.rs — external contract, versioned
pub struct TimeEntryCreatedV1 {
    pub entry_id: String,          // stable external ID format
    pub user_id: String,
    pub start: String,             // ISO 8601 — stable serialisation
    pub end: String,
    pub occurred_at: String,
    pub idempotency_key: String,   // event store position as deduplication key
}
```

The integration event schema uses stable, consumer-friendly types — strings for IDs and timestamps, no internal domain types. The version suffix (`V1`) is explicit in the type name and carried in the message header.

## Event Store Tailing

The event relay runner is a background task spawned by the shell at startup. It polls the event store from a stored checkpoint position and publishes new events:

```rust
// shell/workers/event_relay_runner.rs

pub struct EventRelayRunner {
    event_store: Arc<dyn EventStore<TimeEntryEvent>>,
    relay: Arc<TimeEntriesEventRelay>,
    checkpoint: Arc<dyn EventRelayCheckpoint>,
}

impl EventRelayRunner {
    pub async fn run(&self, interval: Duration) {
        loop {
            let from = self.checkpoint.load().await;
            if let Ok(events) = self.event_store.load_from(from).await {
                for (stream_id, version, event) in events {
                    self.relay.relay(&event, version).await;
                    self.checkpoint.advance(version).await.ok();
                }
            }
            tokio::time::sleep(interval).await;
        }
    }
}
```

In `shell/main.rs`:

```rust
tokio::spawn({
    let runner = event_relay_runner.clone();
    async move {
        runner.run(Duration::from_millis(100)).await;
    }
});
```

## The Event Relay

The relay is an outbound adapter responsible for translating and publishing all domain events from one module. Unlike the intent relay (one relay per intent type), the event relay handles all event types for a module — because all events go to the same bounded context topic and the translation is a simple mapping, not directed routing:

```rust
// adapters/outbound/event_relay/mod.rs

pub struct TimeEntriesEventRelay {
    producer: Arc<dyn KafkaProducer>,
    technical_store: Arc<dyn TechnicalEventStore>,
}

impl TimeEntriesEventRelay {
    pub async fn relay(&self, event: &TimeEntryEvent, position: EventPosition) {
        let start = Instant::now();

        let (event_type, payload) = match self.translate(event, position) {
            Ok(translated) => translated,
            Err(e) => {
                self.technical_store.write(TechnicalEvent::EventRelayTranslationFailed {
                    reason: e.to_string(),
                    position,
                    timestamp: Utc::now(),
                }).await;
                return;
            }
        };

        match self.producer.publish_with_key(
            "time-registration.time-entries",  // bounded context topic
            event.aggregate_id().to_string(),  // ordering key — aggregate ID
            event_type,                        // message header: event type + version
            payload,                           // serialised integration event
        ).await {
            Ok(_) => {
                self.technical_store.write(TechnicalEvent::EventRelayed {
                    event_type: event_type.to_string(),
                    position,
                    topic: "time-registration.time-entries".to_string(),
                    duration_ms: start.elapsed().as_millis() as u64,
                    timestamp: Utc::now(),
                }).await;
            }
            Err(e) => {
                self.technical_store.write(TechnicalEvent::EventRelayFailed {
                    event_type: event_type.to_string(),
                    position,
                    reason: e.to_string(),
                    timestamp: Utc::now(),
                }).await;
                // do not advance checkpoint — retry on next trigger
            }
        }
    }

    fn translate(
        &self,
        event: &TimeEntryEvent,
        position: EventPosition,
    ) -> Result<(&'static str, Vec<u8>), TranslationError> {
        match event {
            TimeEntryEvent::Created(e) => {
                let integration = TimeEntryCreatedV1 {
                    entry_id: e.id.to_string(),
                    user_id: e.user_id.to_string(),
                    start: e.start.to_rfc3339(),
                    end: e.end.to_rfc3339(),
                    occurred_at: Utc::now().to_rfc3339(),
                    idempotency_key: position.to_string(),
                };
                Ok(("TimeEntryCreated/v1", serde_json::to_vec(&integration)?))
            }
            TimeEntryEvent::Approved(e) => {
                let integration = TimeEntryApprovedV1 {
                    entry_id: e.id.to_string(),
                    approved_by: e.approved_by.to_string(),
                    occurred_at: Utc::now().to_rfc3339(),
                    idempotency_key: position.to_string(),
                };
                Ok(("TimeEntryApproved/v1", serde_json::to_vec(&integration)?))
            }
            TimeEntryEvent::Deleted(e) => {
                let integration = TimeEntryDeletedV1 {
                    entry_id: e.id.to_string(),
                    occurred_at: Utc::now().to_rfc3339(),
                    idempotency_key: position.to_string(),
                };
                Ok(("TimeEntryDeleted/v1", serde_json::to_vec(&integration)?))
            }
        }
    }
}
```

## Topic Structure

Each module publishes to one bounded context topic. The event type and version are carried as message headers. Consumers filter on the header to receive only the event types they care about:

```
topic: time-registration.time-entries
  message headers:
    event-type: TimeEntryCreated/v1
    idempotency-key: <event store position>
  key: <aggregate ID>         // ensures ordering per aggregate
  payload: <serialised integration event>
```

One topic per module keeps the number of topics manageable. Consumers subscribe to the topic and filter — they are not coupled to internal partition or routing decisions.

## Ordering Guarantee

Kafka preserves ordering within a partition. By using the aggregate ID as the message key, all events for the same aggregate are routed to the same partition and delivered in order. Consumers that process events for one aggregate at a time will always see them in causal order.

Events for different aggregates may interleave across partitions — this is expected and acceptable. No cross-aggregate ordering guarantee is made or needed.

## Schema Versioning

Integration event schemas are external contracts. They evolve under these rules:

**Additive changes** (new optional fields) — backwards compatible, no version bump required. Existing consumers ignore unknown fields.

**Breaking changes** (removed fields, renamed fields, changed types) — require a new version. The relay publishes both `V1` and `V2` in parallel during a migration window. Consumers migrate to `V2` at their own pace. `V1` is deprecated and removed after all consumers have migrated.

```rust
// both versions published during migration window
TimeEntryEvent::Approved(e) => {
    // V1 — for existing consumers
    self.producer.publish_with_headers("time-registration.time-entries",
        e.id.to_string(), "TimeEntryApproved/v1", v1_payload).await?;

    // V2 — for consumers that have migrated
    self.producer.publish_with_headers("time-registration.time-entries",
        e.id.to_string(), "TimeEntryApproved/v2", v2_payload).await?;
}
```

Version deprecation is enforced via consumer group lag monitoring — if a consumer group stops consuming a version, it can be removed.

## Checkpoint

The relay maintains a checkpoint — the position of the last successfully published event. On restart or failure, the relay resumes from the checkpoint rather than replaying from the beginning:

```rust
// shared/infrastructure/event_relay_checkpoint/mod.rs

#[async_trait]
pub trait EventRelayCheckpoint: Send + Sync {
    async fn load(&self) -> EventPosition;
    async fn advance(&self, position: EventPosition) -> Result<(), StoreError>;
}
```

The checkpoint is advanced only after successful Kafka acknowledgement. If the relay crashes between publishing and advancing the checkpoint, the event is re-published on restart — consumers handle duplicates via the `idempotency_key` header.

## Folder Structure

```
modules/
  time_entries/
    adapters/
      outbound/
        event_relay/
          mod.rs                         // TimeEntriesEventRelay
          integration_events.rs          // TimeEntryCreatedV1, TimeEntryApprovedV1, etc.
        event_store.rs
        intent_outbox.rs
        relays/                          // intent relays per ADR-0008
          ...

shell/
  main.rs
  workers/
    event_relay_runner.rs                // wraps EventRelayRunner in a poll loop
```

## Infrastructure Examples

The event store and checkpoint store ports can be backed by any durable store:

| Store | Implementation | Notes |
|---|---|---|
| Event store | `InMemoryEventStore` | Default — no durability |
| Event store | `PostgresEventStore` | Polling on a `position` sequence column; supports `load_from(checkpoint)` |
| Event store | `RedisEventStore` | Redis Streams with `XREAD` from a stored ID |
| Checkpoint | `InMemoryEventRelayCheckpoint` | Resets on restart |
| Checkpoint | `PostgresEventRelayCheckpoint` | Durable; survives restarts |
| Checkpoint | `RedisEventRelayCheckpoint` | Fast; survives restarts |

The shell chooses all implementations. The relay never knows which backing store is used.

## Intent Relay vs Event Relay Summary

| | Intent Relay (ADR-0008) | Event Relay (this ADR) |
|---|---|---|
| Source | Intent outbox (pull) | Domain event store (stream) |
| Granularity | One relay per intent type | One relay per module |
| Direction | Directed to specific target | Broadcast to topic |
| Ordering | Not required | Required per aggregate |
| Schema | Intent-specific payload | Versioned integration event |
| Checkpoint | `delivered_at` on outbox record | Separate checkpoint store |
| Versioning | Not applicable | Explicit V1/V2 parallel publish |

## Rules

1. External services never read the domain event store directly — all external observation goes through the event relay and integration events
2. Integration event schemas are versioned — breaking changes require parallel publishing during a migration window
3. The aggregate ID is always used as the Kafka message key — ordering per aggregate must be preserved
4. The checkpoint is advanced only after successful Kafka acknowledgement — never before
5. The `idempotency_key` is always the event store position — consumers use it to deduplicate
6. The event relay handles all event types for a module — it is not split per event type
7. Technical events are written for every relay attempt, success, failure, and translation error
