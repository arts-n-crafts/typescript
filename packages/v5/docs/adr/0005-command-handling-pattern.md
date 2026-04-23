---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0005: Command Handling Pattern

## Context and Problem Statement

Commands are the primary way state changes in the system. We need a consistent pattern for how commands flow from inbound adapter through to domain decision, persistence, and outbound communication — one that keeps the functional core pure, makes the application layer thin, and applies cross-cutting concerns like technical events and rejection notifications uniformly across all commands.

## Decision Drivers

- The decider must remain a pure function — no I/O, no side effects
- State reconstruction from events must happen before every decision
- Accepted and rejected decisions must be handled differently but consistently
- Rejection notification to the caller is a cross-cutting application concern, not a domain concern
- Technical events must be written at every meaningful boundary
- The command handler must not contain domain logic — it orchestrates, the decider decides

## Considered Options

1. Decider handles its own persistence and side effects
2. Command handler contains inline domain logic
3. Thin command handler orchestrating pure decider with injected outbound ports
4. Event-sourced aggregate object encapsulating state and behaviour

## Decision Outcome

Chosen option 3: **Thin command handler orchestrating pure decider with injected outbound ports**, because it maintains the functional core's purity, makes the application layer's orchestration role explicit, and keeps domain logic and I/O concerns in clearly separate places.

### Consequences

* Good, because the decider is trivially unit testable — pure function, no mocks needed
* Good, because command handling is uniform across all use cases — developers follow the same pattern every time
* Good, because rejection notification is applied consistently by the application layer — no individual handler can forget it
* Good, because technical events provide a complete audit trail of every command's lifecycle
* Good, because infrastructure failures are clearly distinguished from domain rejections
* Bad, because state reconstruction by replaying all events on every command can be slow for aggregates with long histories — mitigate with snapshots when needed
* Bad, because the command handler is verbose — each handler repeats the same orchestration structure — mitigate with shared helper functions if repetition becomes painful
* Bad, because developers may put domain logic in the command handler instead of the decider — enforce in code review
* Bad, because developers may add `InformCallerOfRejection` in the decider — the rule must be documented and enforced (this ADR serves that purpose)
* Bad, because event store and intent outbox writes are not atomic with each other in all implementations — ensure event store is always written first, intent outbox second

### Confirmation

Compliance is confirmed by code review: decider functions are `fn` (not `async fn`) with no I/O imports; `InformCallerOfRejection` is never returned by a decider; command handlers follow the load → reconstruct → decide → persist → outbox lifecycle without domain conditionals.

## Command Lifecycle

Every command follows this lifecycle without exception:

```
1. Inbound adapter translates transport → Command
2. Command handler receives Command
3. Load current state from event store (reconstruct via evolve)
4. Call pure decider: decide(state, command) → Decision
5a. If Accepted: persist events, write intents to outbox
5b. If Rejected: write InformCallerOfRejection intent to outbox
6. Write technical events throughout
7. Return result to inbound adapter
8. Inbound adapter translates result → transport response
```

## The Decider

The decider is a pure function. It takes current state and a command, returns a Decision. It has no knowledge of persistence, brokers, or callers:

```rust
// use_cases/create_time_entry/handler.rs (or decider inline)

pub fn decide(state: &TimeEntryState, command: CreateTimeEntry) -> Decision {
    if state.exists() {
        return Decision::Rejected {
            reason: RejectionReason::TimeEntryAlreadyExists,
        };
    }

    if command.end <= command.start {
        return Decision::Rejected {
            reason: RejectionReason::InvalidTimeRange,
        };
    }

    Decision::Accepted {
        events: vec![TimeEntryCreated {
            id: command.id,
            user_id: command.user_id,
            start: command.start,
            end: command.end,
        }],
        intents: vec![],
    }
}
```

The decider never adds `InformCallerOfRejection` to its intents. It has no opinion about how rejections are communicated. It only expresses domain judgment.

## State Reconstruction

State is rebuilt by folding all past events through the evolve function before every command:

```rust
// core/evolve.rs

pub fn evolve(state: TimeEntryState, event: &TimeEntryEvent) -> TimeEntryState {
    match event {
        TimeEntryEvent::Created(e) => TimeEntryState::Active {
            id: e.id,
            user_id: e.user_id,
            start: e.start,
            end: e.end,
        },
        TimeEntryEvent::Approved(_) => TimeEntryState::Approved,
        TimeEntryEvent::Deleted(_) => TimeEntryState::Deleted,
    }
}

pub fn reconstruct(events: &[TimeEntryEvent]) -> TimeEntryState {
    events.iter().fold(TimeEntryState::default(), evolve)
}
```

State reconstruction is pure. No I/O. The command handler loads raw events from the event store and passes them to `reconstruct` before calling the decider.

## The Command Handler

The command handler is the imperative shell for one use case. It orchestrates I/O and calls pure functions:

```rust
// use_cases/create_time_entry/handler.rs

pub struct CreateTimeEntryHandler {
    event_store: Arc<dyn EventStore>,
    intent_outbox: Arc<dyn IntentOutbox>,
    technical_store: Arc<dyn TechnicalEventStore>,
}

impl CreateTimeEntryHandler {
    pub async fn handle(&self, command: CreateTimeEntry) -> Result<(), CommandError> {
        let trace_id = command.trace_id;
        let start = Instant::now();

        self.technical_store.write(TechnicalEvent::CommandReceived {
            command_type: "CreateTimeEntry".to_string(),
            trace_id,
            timestamp: Utc::now(),
        }).await;

        // load and reconstruct state
        let events = match self.event_store.load(&command.id).await {
            Ok(events) => events,
            Err(e) => {
                self.technical_store.write(TechnicalEvent::OutboundAdapterFailed {
                    adapter: "EventStore".to_string(),
                    reason: e.to_string(),
                    timestamp: Utc::now(),
                }).await;
                return Err(CommandError::Infrastructure(e));
            }
        };

        let state = reconstruct(&events);

        // pure decision
        match decide(&state, command) {
            Decision::Accepted { events, intents } => {
                // persist events
                if let Err(e) = self.event_store.persist(&events).await {
                    self.technical_store.write(TechnicalEvent::OutboundAdapterFailed {
                        adapter: "EventStore".to_string(),
                        reason: e.to_string(),
                        timestamp: Utc::now(),
                    }).await;
                    return Err(CommandError::Infrastructure(e));
                }

                // write domain intents
                if let Err(e) = self.intent_outbox.write(&intents).await {
                    self.technical_store.write(TechnicalEvent::OutboundAdapterFailed {
                        adapter: "IntentOutbox".to_string(),
                        reason: e.to_string(),
                        timestamp: Utc::now(),
                    }).await;
                    return Err(CommandError::Infrastructure(e));
                }

                self.technical_store.write(TechnicalEvent::CommandAccepted {
                    command_type: "CreateTimeEntry".to_string(),
                    event_count: events.len(),
                    intent_count: intents.len(),
                    duration_ms: start.elapsed().as_millis() as u64,
                    trace_id,
                    timestamp: Utc::now(),
                }).await;

                Ok(())
            }

            Decision::Rejected { reason } => {
                // application layer adds rejection notification — not the decider
                self.intent_outbox.write(&[
                    Intent::InformCallerOfRejection { reason: reason.clone() }
                ]).await.ok(); // best effort — rejection notification failure is non-fatal

                self.technical_store.write(TechnicalEvent::CommandRejected {
                    command_type: "CreateTimeEntry".to_string(),
                    reason: reason.to_string(),
                    duration_ms: start.elapsed().as_millis() as u64,
                    trace_id,
                    timestamp: Utc::now(),
                }).await;

                Err(CommandError::Rejected(reason))
            }
        }
    }
}
```

## Decision Type

Each use case defines its own Decision type in `decision.rs`:

```rust
// use_cases/create_time_entry/decision.rs

pub enum Decision {
    Accepted {
        events: Vec<TimeEntryEvent>,
        intents: Vec<Intent>,
    },
    Rejected {
        reason: RejectionReason,
    },
}
```

`RejectionReason` is a domain enum — typed, meaningful, not a string. The inbound adapter translates it to an appropriate transport response. The intent relay translates it to a broker message schema.

## Inbound Adapter Responsibilities

The inbound adapter owns transport translation only. It does not contain domain logic or orchestration:

```rust
// use_cases/create_time_entry/inbound/http.rs

pub async fn handle(&self, request: Request) -> Response {
    self.technical_store.write(TechnicalEvent::HttpRequestReceived { .. }).await;

    let command = match self.translate(&request) {
        Ok(cmd) => cmd,
        Err(e) => {
            self.technical_store.write(TechnicalEvent::ValidationFailed { .. }).await;
            return StatusCode::BAD_REQUEST.into_response();
        }
    };

    match self.handler.handle(command).await {
        Ok(_) => StatusCode::CREATED.into_response(),
        Err(CommandError::Rejected(reason)) => {
            // caller also gets async notification via outbox
            // this is the immediate synchronous transport response
            (StatusCode::UNPROCESSABLE_ENTITY, reason.to_string()).into_response()
        }
        Err(CommandError::Infrastructure(_)) => {
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
```

Note that for HTTP callers, the rejection is communicated both synchronously (4xx response) and asynchronously (via outbox → Kafka results topic). For Kafka/SQS callers there is no synchronous response — only the async notification via outbox.

## Rules

1. The decider is always a pure function — no async, no I/O, no side effects
2. State is always reconstructed from events before calling the decider — never passed in from outside
3. The decider never expresses how rejections are communicated — that is the handler's responsibility
4. The command handler never contains domain rules — if/else on business conditions belongs in the decider
5. Technical events are written at every meaningful boundary — command received, accepted, rejected, outbound failure
6. Outbound failures are captured as technical events and returned as infrastructure errors — they do not become domain rejections
