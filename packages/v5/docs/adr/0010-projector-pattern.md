# ADR-0010: Projector Pattern

## Status

Accepted

## Context and Problem Statement

Query handlers read from pre-built projections as established in ADR-0006. Something must build and maintain those projections by processing domain events as they are written. We need a consistent pattern for how projectors receive events, apply them to projection state, manage their position in the event stream, and handle schema changes — in a monolithic, in-memory deployment.

## Decision Drivers

- The command handler must not be responsible for notifying projectors — it has its own lifecycle concerns
- The event store must not know about projectors — it should remain unaware of its consumers
- Each query use case owns its own projector — projectors are not shared across query handlers
- Projection state and checkpoint position are co-located in the projection store
- Schema changes must trigger automatic rebuild without manual intervention
- Each projector runs independently and does not block or depend on others
- The pattern must be replaceable with a durable event stream consumer in future without changing projector logic

## Considered Options

1. Command handler calls projectors directly after persisting events
1. Event store notifies registered projectors via callback
1. In-process pub/sub channel — event store publishes, projectors subscribe independently
1. Polling loop — projector checks for new events on an interval

## Decision Outcome

Chosen option 3: **In-process pub/sub channel — event store publishes to a channel, projectors subscribe independently**, because it decouples the event store from its consumers, allows each projector to run at its own pace, mirrors how a durable event stream consumer would behave in future, and requires no changes to the event store when projectors are added or removed.

-----

## Event Publication from the Event Store

When the event store persists a new event it publishes it to a broadcast channel. The event store holds a sender handle to the channel. It has no knowledge of who is subscribed or how many projectors exist:

```
event store persists events
  → publishes each event to broadcast channel
      → projector A receives via its own subscription
      → projector B receives via its own subscription
      → projector N receives via its own subscription
```

Each projector holds its own receiver handle, obtained when it is registered at startup. The shell creates the channel, passes the sender to the event store, and passes individual receivers to each projector.

-----

## Projector Scope

Each query use case owns exactly one projector. The projector is responsible for one projection and nothing else. It lives alongside its query use case:

```
use_cases/
  list_time_entries/
    mod.rs
    queries.rs
    projection.rs      // projection state and apply function
    projector.rs       // projector — receives events, updates projection store
    handler.rs         // query handler — reads from projection store
    inbound/
      http.rs
```

Projectors for different query use cases have no knowledge of each other. Each subscribes to the same broadcast channel but processes events independently.

-----

## Projection Store

The projection store holds both the projection state and the checkpoint position. It is shared between the projector (writer) and the query handler (reader) via a port:

```
shared/infrastructure/projection_store/
  mod.rs        // pub trait ProjectionStore<P>
  in_memory.rs  // in-memory implementation using RwLock
```

The port exposes load, save, checkpoint read, and checkpoint advance operations. The projector writes; the query handler reads. Neither knows about the other's existence — they only know about the store.

The projection store also holds the current schema version. On startup, the projector reads the stored schema version and compares it to its own declared version. A mismatch triggers an automatic rebuild before normal processing begins.

-----

## Projection State and Apply

The projection itself is a pure data structure with a pure apply function. It lives in the use case alongside the projector:

The apply function takes the current projection state and a single domain event and returns the updated state. It has no side effects. The projector calls apply for each received event and writes the result back to the projection store.

Only events relevant to the projection are applied. Events the projection does not care about are ignored — the projector matches on event type and skips unrecognised variants.

-----

## Schema Versioning and Automatic Rebuild

Each projector declares a schema version as a constant. On startup, the projector reads the schema version stored in the projection store and compares it to its declared version:

- If versions match — normal processing resumes from the stored checkpoint position
- If versions differ — the projector clears the projection store, resets the checkpoint to zero, replays all events from the beginning, and saves the new schema version once complete

Rebuild happens before the projector begins serving the channel — queries served during rebuild read from an empty or partially built projection. This is acceptable for an in-memory monolith where rebuild is fast. If read-your-own-writes consistency during rebuild is required, the query handler can return an explicit rebuilding status.

-----

## Projector Runtime

Each projector runs in its own async task, spawned independently by the shell at startup. The shell passes the projector its channel receiver, its projection store, and the event store reference needed for replay during rebuild:

```
shell spawns per projector:
  tokio::spawn(projector.run())
```

The projector's run loop:

1. On startup — compare schema versions, rebuild if mismatch
1. Enter receive loop — await next event from channel
1. Apply event to projection state via pure apply function
1. Save updated projection state and advance checkpoint in projection store
1. Write technical event for observability
1. Return to step 2

The projector never exits the loop in normal operation. If the channel sender is dropped (process shutdown) the loop terminates naturally.

-----

## Checkpoint

The checkpoint is the position of the last successfully applied event. It is stored alongside the projection state in the projection store. The projector advances the checkpoint after successfully saving the updated projection state — never before.

On rebuild, the checkpoint is reset to zero and advanced event by event through the full replay. The projection store does not serve queries with stale state during rebuild — the projector applies events in order and the store reflects the latest applied state at all times during replay.

-----

## Technical Events

The projector writes a technical event after each successfully applied event and after each rebuild lifecycle stage. This provides observability over projector lag and rebuild duration:

- `ProjectionEventApplied` — event type, projection name, checkpoint position, duration
- `ProjectionRebuildStarted` — projection name, schema version, timestamp
- `ProjectionRebuildCompleted` — projection name, event count replayed, duration, timestamp
- `ProjectionRebuildFailed` — projection name, reason, timestamp

-----

## Folder Structure

```
modules/
  time_entries/
    use_cases/
      list_time_entries/
        mod.rs
        queries.rs
        projection.rs       // ProjectionState, apply fn, SCHEMA_VERSION constant
        projector.rs        // ListTimeEntriesProjector — run loop, rebuild logic
        handler.rs
        inbound/
          http.rs

shared/
  infrastructure/
    projection_store/
      mod.rs                // pub trait ProjectionStore<P>
      in_memory.rs          // InMemoryProjectionStore — RwLock, version, checkpoint
```

-----

## Shell Wiring

The shell creates the broadcast channel, passes the sender to the event store, and spawns each projector with its own receiver:

```
shell:
  create broadcast channel (sender, receiver factory)
  inject sender into event store

  for each query use case:
    create receiver from channel
    create projection store (in-memory)
    create projector with receiver + projection store + event store
    tokio::spawn(projector.run())

  inject projection stores into query handlers
```

The shell is the only place that knows the full wiring. Projectors and query handlers know only about their projection store port.

-----

## Rules

1. The event store publishes to the channel after successfully persisting — never before
1. The projector applies events in the order they are received — it never reorders
1. The checkpoint advances only after the projection state is successfully saved — never before
1. Schema version mismatch always triggers a full rebuild from position zero — partial replay is not permitted
1. The projector ignores events it does not recognise — it does not error on unknown event types
1. The projector never calls the command handler or writes to the event store
1. The query handler never writes to the projection store — only the projector writes
1. Technical events are written for every applied event and every rebuild lifecycle stage

-----

## Consequences

### Positive

- The event store has no knowledge of projectors — adding or removing a projector requires no changes to the event store
- Each projector is independent — a slow or failing projector does not affect others
- Schema versioning makes projection evolution safe and automatic — no manual migration step
- The projection store port means the in-memory implementation can be replaced with a durable one without touching projector or query handler logic
- The pattern mirrors a durable event stream consumer — migration to a distributed deployment requires only replacing the channel with a real stream subscription

### Negative

- Queries may return stale or empty data immediately after startup while projectors replay — acceptable for in-memory deployments where replay is fast
- Each projector holds its own channel subscription — if the event rate is high and a projector is slow, the channel buffer can grow — monitor via technical events
- Rebuild blocks normal event processing for that projector until complete — mitigated by fast in-memory replay

### Risks

- Developer applying events in the projector outside the pure apply function, introducing side effects — enforce that apply is always a pure function in the projection module, projector only calls it and saves result
- Developer writing to the projection store from the query handler — enforce the rule that query handlers are read-only consumers of the projection store
- Channel buffer overflow if a projector falls significantly behind — set an appropriate channel buffer size in the shell and monitor projector lag via technical events
