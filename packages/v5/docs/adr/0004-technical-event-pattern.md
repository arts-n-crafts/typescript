---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0004: Technical Event Pattern

## Context and Problem Statement

The system needs observability at every I/O boundary — inbound requests, outbound writes, failures, latencies. Traditional logging provides this but produces unstructured or semi-structured text that is hard to query, aggregate, or react to programmatically. We want a fully event-centric system where observability is achieved through the same structured event model used for domain and integration concerns.

## Decision Drivers

- No logging — observability is achieved exclusively through structured events
- I/O facts must be captured at every adapter boundary regardless of direction
- Technical events must be queryable and consumable by monitoring and analysis systems
- Technical events must not pollute the domain event store
- Writing a technical event must not fail silently or block the main flow
- The technical event store must be treated as always available — it is the observability bedrock

## Considered Options

1. Structured logging (tracing, log crates) with a log aggregator
2. Metrics only (counters, histograms via Prometheus/CloudWatch)
3. Technical events as a first-class event type written to a dedicated store
4. Mix of metrics and structured logs

## Decision Outcome

Chosen option 3: **Technical events as a first-class event type written to a dedicated store**, because it makes observability consistent with the rest of the system's event-centric model, produces structured queryable facts rather than text, and enables analysis workflows that can react to operational patterns — not just observe them passively.

### Consequences

* Good, because full observability without a single log statement — every I/O fact is a structured, queryable event
* Good, because rejection rates, latencies, failure patterns, and adapter health are all derivable from technical events
* Good, because technical events can feed automated alerting and analysis pipelines — not just passive observation
* Good, because consistent model throughout the system — domain events, intents, and technical events all follow the same pattern
* Good, because swapping the technical event store implementation (in-memory → Postgres → stdout) requires no changes outside the shell
* Bad, because every adapter must be injected with the `TechnicalEventStore` port — more wiring in the shell
* Bad, because the `TechnicalEvent` enum grows as the system grows — mitigated by grouping variants by boundary
* Bad, because fire-and-forget write semantics mean a degraded technical event store may silently drop events — acceptable for observability, unacceptable for domain events
* Bad, because developers may add log statements instead of technical events as the system grows — enforce in code review and ADR awareness
* Bad, because technical event variants can become too granular or too coarse — calibrate around what analysis systems actually query
* Bad, because the `TechnicalEvent` enum can become a shared dependency causing frequent recompilation — consider splitting by module if compile times become a concern

### Confirmation

Compliance is confirmed by verifying no `log::`, `tracing::`, or `println!` calls exist outside the shell; `TechnicalEventStore::write` is called at every adapter boundary; the technical event store is never written transactionally with domain events.

## What is a Technical Event

A technical event is a structured fact about what the system did at an I/O boundary. It is not a domain fact (nothing happened in the business domain) and not an intent (nothing is being asked of an external system). It is an observation:

```rust
pub enum TechnicalEvent {
    // Inbound
    HttpRequestReceived { method: String, path: String, trace_id: TraceId, timestamp: DateTime<Utc> },
    HttpResponseSent { status: u16, duration_ms: u64, trace_id: TraceId, timestamp: DateTime<Utc> },
    KafkaMessageReceived { topic: String, partition: i32, offset: i64, timestamp: DateTime<Utc> },
    KafkaMessageHandled { topic: String, duration_ms: u64, timestamp: DateTime<Utc> },
    ValidationFailed { reason: String, trace_id: TraceId, timestamp: DateTime<Utc> },

    // Outbound
    EventStoreWriteCompleted { aggregate_id: String, event_count: usize, duration_ms: u64, timestamp: DateTime<Utc> },
    EventStoreReadCompleted { aggregate_id: String, event_count: usize, duration_ms: u64, timestamp: DateTime<Utc> },
    OutboundAdapterFailed { adapter: String, reason: String, timestamp: DateTime<Utc> },
    IntentOutboxWriteCompleted { intent_count: usize, duration_ms: u64, timestamp: DateTime<Utc> },

    // Command / Query lifecycle
    CommandReceived { command_type: String, trace_id: TraceId, timestamp: DateTime<Utc> },
    CommandAccepted { command_type: String, event_count: usize, intent_count: usize, duration_ms: u64, trace_id: TraceId, timestamp: DateTime<Utc> },
    CommandRejected { command_type: String, reason: String, duration_ms: u64, trace_id: TraceId, timestamp: DateTime<Utc> },
    QueryReceived { query_type: String, trace_id: TraceId, timestamp: DateTime<Utc> },
    QueryCompleted { query_type: String, duration_ms: u64, trace_id: TraceId, timestamp: DateTime<Utc> },
}
```

## Where Technical Events Are Written

Technical events are written at every adapter boundary — both inbound and outbound. The `TechnicalEventStore` port is injected into every adapter that sits at an I/O boundary:

### Inbound adapters

Capture facts about incoming requests and their outcomes:

```rust
// use_cases/create_time_entry/inbound/http.rs

pub async fn handle(&self, request: Request) {
    self.technical_store.write(TechnicalEvent::HttpRequestReceived {
        method: request.method().to_string(),
        path: request.uri().path().to_string(),
        trace_id: extract_trace_id(&request),
        timestamp: Utc::now(),
    }).await;

    let start = Instant::now();

    match self.translate(&request) {
        Err(e) => {
            self.technical_store.write(TechnicalEvent::ValidationFailed {
                reason: e.to_string(),
                trace_id: extract_trace_id(&request),
                timestamp: Utc::now(),
            }).await;
            return bad_request(e);
        }
        Ok(command) => {
            let result = self.handler.handle(command).await;

            self.technical_store.write(TechnicalEvent::HttpResponseSent {
                status: result.status_code(),
                duration_ms: start.elapsed().as_millis() as u64,
                trace_id: extract_trace_id(&request),
                timestamp: Utc::now(),
            }).await;

            result.into_response()
        }
    }
}
```

### Command handlers

Capture the outcome of domain decisions and outbound writes:

```rust
// use_cases/create_time_entry/handler.rs

self.technical_store.write(TechnicalEvent::CommandReceived {
    command_type: "CreateTimeEntry".to_string(),
    trace_id,
    timestamp: Utc::now(),
}).await;

match decider::decide(&state, &command) {
    Decision::Accepted { events, intents } => {
        // persist events
        match self.event_store.persist(&events).await {
            Err(e) => {
                self.technical_store.write(TechnicalEvent::OutboundAdapterFailed {
                    adapter: "EventStore".to_string(),
                    reason: e.to_string(),
                    timestamp: Utc::now(),
                }).await;
                return Err(e);
            }
            Ok(_) => {}
        }

        self.technical_store.write(TechnicalEvent::CommandAccepted {
            command_type: "CreateTimeEntry".to_string(),
            event_count: events.len(),
            intent_count: intents.len(),
            duration_ms: start.elapsed().as_millis() as u64,
            trace_id,
            timestamp: Utc::now(),
        }).await;
    }
    Decision::Rejected { reason } => {
        self.technical_store.write(TechnicalEvent::CommandRejected {
            command_type: "CreateTimeEntry".to_string(),
            reason: reason.to_string(),
            duration_ms: start.elapsed().as_millis() as u64,
            trace_id,
            timestamp: Utc::now(),
        }).await;
    }
}
```

## The TechnicalEventStore Port

The port is defined in `shared/infrastructure/technical_event_store/` and injected into every adapter via the shell:

```rust
// shared/infrastructure/technical_event_store/mod.rs

#[async_trait]
pub trait TechnicalEventStore: Send + Sync {
    async fn write(&self, event: TechnicalEvent);
}
```

Note that `write` has no return type — writing a technical event is fire-and-forget. A failure to write a technical event must never propagate up and affect the main flow. Implementations handle their own error recovery internally.

## Implementations

```
shared/infrastructure/technical_event_store/
  mod.rs             // pub trait TechnicalEventStore
  in_memory.rs       // default — for development, testing, and simple deployments
  postgres.rs        // write structured JSON rows to a Postgres table
  stdout.rs          // write structured JSON to stdout — consumed by log aggregators
```

The default `InMemoryTechnicalEventStore` is sufficient for development and testing. In production, `PostgresTechnicalEventStore` writes structured rows queryable by any SQL tool. `StdoutTechnicalEventStore` emits newline-delimited JSON consumed by any log aggregator (Loki, Datadog, etc.).

## Technical Events vs Domain Events vs Integration Events

| | Domain Events | Integration Events | Technical Events |
|---|---|---|---|
| What | Facts about domain state changes | Domain facts shaped for external consumers | I/O facts about system behaviour |
| Where stored | Domain event store | Published via event relay | Technical event store |
| Who consumes | Application (projections, state) | External services | Monitoring, analysis, alerting |
| Schema stability | Internal, evolves freely | Stable contract, versioned | Internal, evolves freely |
| Examples | `TimeEntryApproved` | `TimeEntryApprovedV1` | `CommandAccepted`, `OutboundAdapterFailed` |

These three stores must remain separate. Mixing them conflates domain facts with operational observations and creates schema coupling between internal observability and external integration contracts.
