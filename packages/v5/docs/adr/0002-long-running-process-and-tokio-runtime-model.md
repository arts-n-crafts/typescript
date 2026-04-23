---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0002: Long-Running Process and tokio Runtime Model

## Context and Problem Statement

ADR-0001 established a modular FCIS folder structure with a `shell/` as the composition root. We need to decide how the shell starts, how background workers (projector, intent relay runner, event relay runner) are kept running, and how the process shuts down cleanly.

## Decision Drivers

- The shell is the only place that instantiates concrete infrastructure and wires use cases together
- Background workers must run for the lifetime of the process — they are not one-shot tasks
- The runtime model must not bleed into use cases, handlers, or adapters
- Graceful shutdown must drain in-flight requests and allow workers to finish their current iteration
- Local development and production must use the same process model

## Considered Options

1. Separate OS processes per worker (one process per projector, one per relay runner)
2. Single long-running process with `std::thread` per worker
3. Single long-running process with `tokio::spawn` background tasks

## Decision Outcome

Chosen option 3: **Single long-running process with `tokio::spawn` background tasks**, because it maps naturally to the async Rust ecosystem, shares infrastructure instances across the process without inter-process communication, and keeps the composition root simple.

### Consequences

* Good, because all infrastructure instances (event store, outbox, projection store) are shared in-process — no serialisation or IPC overhead
* Good, because `tokio::spawn` tasks are lightweight and composable — adding a new background worker is one line in `main.rs`
* Good, because graceful shutdown via `tokio::signal` drains naturally — tasks observe a cancellation token and finish their current iteration
* Good, because the same binary runs locally and in production — no separate packages or deployment configurations
* Bad, because a panic in a background task silently stops that worker — mitigate with `tokio::spawn` panic handlers and technical events on task exit
* Bad, because all workers share the same process memory — a memory leak in one worker affects the whole process
* Bad, because scaling individual workers independently requires running multiple instances of the whole binary — acceptable at this stage

### Confirmation

Compliance is confirmed by verifying no cloud-runtime types appear anywhere in the codebase; all background tasks are spawned in `main.rs`; the process exits cleanly on SIGTERM.

## Shell Structure

`shell/main.rs` is the composition root. It follows this sequence:

```
1. Read config from environment variables
2. Instantiate infrastructure implementations
3. Wire use case handlers (inject infrastructure via ports)
4. Spawn background workers via tokio::spawn
5. Start HTTP server (Axum)
6. Await shutdown signal (SIGTERM / Ctrl-C)
7. Cancel background workers and drain HTTP connections
```

## Background Workers

Each background worker is an infinite poll loop with a configurable sleep interval, wrapped in `tokio::spawn`:

```rust
// shell/main.rs

let projector = Arc::new(Projector::new(
    "time-entries-projector".to_string(),
    projection_store.clone(),
    projection_store.clone(),
));

tokio::spawn({
    let projector = projector.clone();
    let event_store = event_store.clone();
    async move {
        loop {
            let checkpoint = projector.watermark().await.unwrap_or(0);
            if let Ok(events) = event_store.load_from(checkpoint).await {
                for (stream_id, version, event) in events {
                    projector.apply_one(&stream_id, version, &event).await.ok();
                }
            }
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    }
});
```

Workers started at boot:
- One projector per module (per query use case that requires a projection)
- One intent relay runner (polls the intent outbox and dispatches to per-intent relays)
- One event relay runner (tails the event store and publishes integration events)

## Folder Structure

```
shell/
  main.rs      // composition root — wires everything, spawns workers, starts server
  workers/
    projector_runner.rs      // wraps Projector in a poll loop
    intent_relay_runner.rs   // wraps IntentRelayRunner in a poll loop
    event_relay_runner.rs    // wraps EventRelayRunner in a poll loop
```

## Infrastructure Examples

The shell is the only place that chooses a concrete implementation. Common options per store:

| Store | In-memory (default) | Common option 1 | Common option 2 |
|-------|---------------------|-----------------|-----------------|
| Event store | `InMemoryEventStore` | `PostgresEventStore` | `RedisEventStore` |
| Intent outbox | `InMemoryDomainOutbox` | `PostgresDomainOutbox` | `RedisDomainOutbox` |
| Projection store | `InMemoryProjections` | `PostgresProjectionStore` | `RedisProjectionStore` |
| Technical event store | `InMemoryTechnicalEventStore` | `PostgresTechnicalEventStore` | `StdoutTechnicalEventStore` |

## Relation to ADR-0001

This ADR extends ADR-0001 by specifying how the `shell/` layer starts and runs. The modular FCIS structure defined in ADR-0001 is unchanged — this ADR only concerns the process lifecycle and worker model.
