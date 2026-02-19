# GenericOutboxWorker

> Concrete `OutboxWorker` that drains pending outbox entries and publishes each to the `EventBus`, with per-entry error isolation.

## What it is

`GenericOutboxWorker` is the standard implementation of [`OutboxWorker`](./OutboxWorker.md). It is
constructed with an [`Outbox`](./Outbox.md), an `EventProducer` (the publish-side of
[`EventBus`](./EventBus.md)), and a stream name.

**`runOnce()`** fetches all pending entries via `outbox.getPending()` and publishes them
concurrently via `Promise.all`. Each entry is handled independently:

- On success → `outbox.markAsPublished(entry.id)`
- On failure → `outbox.markAsFailed(entry.id)` (increments `retryCount`, records `lastAttemptAt`)

The try/catch is scoped per entry, so a single publish failure does not prevent other entries from
being delivered. This gives at-least-once delivery semantics: entries are retried on subsequent
ticks until they succeed.

**`tick()`** delegates to `runOnce()`. It exists as a named scheduling hook, keeping the polling
loop decoupled from the delivery logic.

**`start(intervalMs)`** starts a `setInterval` loop that calls `tick()` every `intervalMs`
milliseconds. Errors from `tick()` are caught and logged via `console.error` to prevent the
interval from silently dying.

`outbox`, `eventBus`, and `stream` are `protected` to allow subclassing.

## Usage

```typescript
import { GenericOutboxWorker } from '@infrastructure/Outbox/implementations/GenericOutboxWorker.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'

const outbox = new InMemoryOutbox()
const worker = new GenericOutboxWorker(outbox, eventBus, 'users')

// Single drain (e.g. in a test or cron trigger):
await worker.runOnce()

// Continuous background loop:
worker.start(1000) // polls every 1 second
```

## Related

- **Interface**: [`OutboxWorker`](./OutboxWorker.md)
- **Outbox**: [`InMemoryOutbox`](./InMemoryOutbox.md)
- **Tests**: [`OutboxWorker.spec.ts`](../Outbox/OutboxWorker.spec.ts)
- **Depends on**: [`Outbox`](./Outbox.md), [`EventBus`](./EventBus.md)
