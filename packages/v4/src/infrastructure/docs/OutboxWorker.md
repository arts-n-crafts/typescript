# OutboxWorker

> The background process that drains the outbox and publishes pending entries to the EventBus.

## What it is

`OutboxWorker` is the delivery agent for the **Transactional Outbox** pattern.
It polls the [`Outbox`](./Outbox.md) for unpublished entries and publishes each
one to the [`EventBus`](./EventBus.md), completing the at-least-once delivery
guarantee.

The interface has three operations:

- **`runOnce()`** — fetches all pending entries and attempts to publish each.
  On success it calls `markAsPublished`; on failure it calls `markAsFailed` and
  increments the retry counter.
- **`tick()`** — a single scheduled invocation; delegates to `runOnce()`.
- **`start(intervalMs)`** — starts a `setInterval` loop that calls `tick()`
  every `intervalMs` milliseconds. Used for continuous background processing.

`GenericOutboxWorker` is the concrete implementation. It is constructed with an
`Outbox`, an `EventBus` (as `EventProducer`), and a stream name. Each published
entry is delivered to `eventBus.publish(stream, entry.event)` — the
`IntegrationEvent` stored in the `OutboxEntry` is the payload.

## Interface

```typescript
export interface OutboxWorker {
  runOnce(): Promise<void>
  tick(): Promise<void>
  start(intervalMs: number): void
}
```

## Usage

```typescript
import { GenericOutboxWorker } from '@infrastructure/Outbox/implementations/GenericOutboxWorker.ts'

const worker = new GenericOutboxWorker(outbox, eventBus, 'users')

// Run once (e.g. in a test or cron trigger):
await worker.runOnce()

// Or start a continuous background loop:
worker.start(1000) // polls every 1 second
```

## Related

- **Implementation**: [`GenericOutboxWorker`](./GenericOutboxWorker.md)
- **Tests**: [`OutboxWorker.spec.ts`](../Outbox/OutboxWorker.spec.ts)
- **Used by**: Application bootstrap, [`ScenarioTest`](./ScenarioTest.md)
- **Depends on**: [`Outbox`](./Outbox.md), [`EventBus`](./EventBus.md)
