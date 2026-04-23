---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0006: Query Handling Pattern

## Context and Problem Statement

Queries read state without changing it. We need a consistent pattern for how queries are served — how projections are built from domain events, where projection state lives, how query handlers read from projections, and how the query side stays completely isolated from the command side.

## Decision Drivers

- Query handlers must never trigger state changes — no commands, no events, no intents
- Projections are built from domain events — the event store is the source of truth
- Each query use case owns its own projection — projections are not shared across query handlers
- Query handlers must be as fast as possible — they should read from a pre-built projection, not replay events on every request
- Technical events must be written for observability

## Considered Options

1. Query handlers replay events on every request to build state inline
2. Query handlers read from a shared relational read model updated by triggers
3. Query handlers read from use case-specific projections maintained by a projector
4. Query handlers call the command side to retrieve state

## Decision Outcome

Chosen option 3: **Query handlers read from use case-specific projections maintained by a projector**, because it keeps projections focused and owned by their use case, avoids replaying events on every query, and maintains clear separation between the command and query sides.

### Consequences

* Good, because query handlers are fast — they read from a pre-built projection, no event replay on each request
* Good, because each projection is shaped exactly for its query — no general-purpose read model that serves everything poorly
* Good, because the command and query sides are completely isolated — neither can accidentally affect the other
* Good, because projections can be rebuilt at any time by replaying events through the projector from the beginning
* Good, because adding a new query use case means adding a new projection and handler — the event store is untouched
* Bad, because eventual consistency means queries may lag slightly behind the latest command — must be communicated to API consumers
* Bad, because each query use case runs its own projector — multiple projectors reading the same event stream adds load to the event store — mitigate with a shared event subscription that fans out
* Bad, because projection rebuild (full replay) can be slow for long event histories — plan for this operationally
* Bad, because developers may query the event store directly from a query handler for convenience — enforce the rule that query handlers only touch the projection store
* Bad, because projection schema migration when events change shape requires a full rebuild — the projection is always disposable
* Bad, because a projector falling significantly behind may go unnoticed — monitor via technical events and alert on threshold breaches

### Confirmation

Compliance is confirmed by code review: query handlers import only from the projection store port, never from the event store or any command-side type; projectors run as background tasks started by the shell, never called inline from a query handler.

## Projection

A projection is a read model built by folding domain events into a shape optimised for one specific query. It is use case specific and lives inside the query use case:

```rust
// use_cases/list_time_entries/projection.rs

#[derive(Default)]
pub struct ListTimeEntriesProjection {
    entries: HashMap<TimeEntryId, TimeEntrySummary>,
}

#[derive(Clone)]
pub struct TimeEntrySummary {
    pub id: TimeEntryId,
    pub user_id: UserId,
    pub start: DateTime<Utc>,
    pub end: DateTime<Utc>,
    pub status: TimeEntryStatus,
}

impl ListTimeEntriesProjection {
    pub fn apply(&mut self, event: &TimeEntryEvent) {
        match event {
            TimeEntryEvent::Created(e) => {
                self.entries.insert(e.id, TimeEntrySummary {
                    id: e.id,
                    user_id: e.user_id,
                    start: e.start,
                    end: e.end,
                    status: TimeEntryStatus::Active,
                });
            }
            TimeEntryEvent::Approved(e) => {
                if let Some(entry) = self.entries.get_mut(&e.id) {
                    entry.status = TimeEntryStatus::Approved;
                }
            }
            TimeEntryEvent::Deleted(e) => {
                self.entries.remove(&e.id);
            }
        }
    }

    pub fn list(&self, user_id: &UserId) -> Vec<TimeEntrySummary> {
        self.entries.values()
            .filter(|e| &e.user_id == user_id)
            .cloned()
            .collect()
    }
}
```

`apply` is a pure function — it takes an event and updates the projection state. No I/O.

## The Projector

The projector runs asynchronously, tailing the domain event store and applying new events to the projection. It is the bridge between the event store and the projection store:

```rust
// adapters/outbound/projector.rs

pub struct ListTimeEntriesProjector {
    event_store: Arc<dyn EventStore>,
    projection_store: Arc<dyn ProjectionStore<ListTimeEntriesProjection>>,
    technical_store: Arc<dyn TechnicalEventStore>,
}

impl ListTimeEntriesProjector {
    pub async fn run(&self) {
        loop {
            let checkpoint = self.projection_store.checkpoint().await;
            let new_events = self.event_store.load_from(checkpoint).await;

            for event in new_events {
                let mut projection = self.projection_store.load().await;
                projection.apply(&event);
                self.projection_store.save(projection, event.position).await;

                self.technical_store.write(TechnicalEvent::ProjectionUpdateCompleted {
                    projection: "ListTimeEntries".to_string(),
                    timestamp: Utc::now(),
                }).await;
            }

            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    }
}
```

The projector is an outbound adapter — it reads from the event store and writes to the projection store. It runs in the background, started by the shell.

## The Query Handler

The query handler reads directly from the pre-built projection. It does not touch the event store or the command side:

```rust
// use_cases/list_time_entries/handler.rs

pub struct ListTimeEntriesHandler {
    projection_store: Arc<dyn ProjectionStore<ListTimeEntriesProjection>>,
    technical_store: Arc<dyn TechnicalEventStore>,
}

impl ListTimeEntriesHandler {
    pub async fn handle(&self, query: ListTimeEntries) -> Result<Vec<TimeEntrySummary>, QueryError> {
        let trace_id = query.trace_id;
        let start = Instant::now();

        self.technical_store.write(TechnicalEvent::QueryReceived {
            query_type: "ListTimeEntries".to_string(),
            trace_id,
            timestamp: Utc::now(),
        }).await;

        let projection = match self.projection_store.load().await {
            Ok(p) => p,
            Err(e) => {
                self.technical_store.write(TechnicalEvent::OutboundAdapterFailed {
                    adapter: "ProjectionStore".to_string(),
                    reason: e.to_string(),
                    timestamp: Utc::now(),
                }).await;
                return Err(QueryError::Infrastructure(e));
            }
        };

        let result = projection.list(&query.user_id);

        self.technical_store.write(TechnicalEvent::QueryCompleted {
            query_type: "ListTimeEntries".to_string(),
            duration_ms: start.elapsed().as_millis() as u64,
            trace_id,
            timestamp: Utc::now(),
        }).await;

        Ok(result)
    }
}
```

## Query Type

Each query use case defines its own query type in `queries.rs`:

```rust
// use_cases/list_time_entries/queries.rs

pub struct ListTimeEntries {
    pub user_id: UserId,
    pub trace_id: TraceId,
}
```

Queries carry only what is needed to serve the read — filters, pagination, identifiers. They never carry state or commands.

## Projection Store Port

The projection store port is defined in shared infrastructure and implemented per deployment target:

```rust
// shared/infrastructure/projection_store/mod.rs

#[async_trait]
pub trait ProjectionStore<P>: Send + Sync {
    async fn load(&self) -> Result<P, StoreError>;
    async fn save(&self, projection: P, checkpoint: EventPosition) -> Result<(), StoreError>;
    async fn checkpoint(&self) -> EventPosition;
}
```

```
shared/infrastructure/projection_store/
  mod.rs          // pub trait ProjectionStore
  in_memory.rs    // for local development
  dynamodb.rs     // for production
  redis.rs        // for low-latency read models
```

## Eventual Consistency

Projections are eventually consistent with the event store. A query served immediately after a command may not yet reflect the latest events — the projector has a small processing lag. This is accepted and by design. If a use case requires read-your-own-writes consistency, the command handler can return the decision events directly to the inbound adapter which can construct an immediate response without going through the projection.

## Shared Projection Mappings

Some projection logic is shared across multiple query use cases — for example, mapping a `TimeEntryCreated` event to a common `TimeEntrySummary` type. These shared mappings live in `core/projections.rs` at the module level:

```rust
// core/projections.rs

pub fn to_summary(event: &TimeEntryCreated) -> TimeEntrySummary {
    TimeEntrySummary {
        id: event.id,
        user_id: event.user_id,
        start: event.start,
        end: event.end,
        status: TimeEntryStatus::Active,
    }
}
```

Use case-specific projections call these shared mappings rather than duplicating the transformation logic.

## Rules

1. Query handlers never write to the event store, intent outbox, or any command-side store
2. Query handlers never call command handlers
3. Each query use case owns its own projection — projections are not shared between query handlers
4. The projector runs asynchronously — it is never called inline during a query
5. Projection state is always read from the projection store — never rebuilt from raw events on each request
6. Shared event-to-model mappings live in `core/projections.rs` — use case projections call them
