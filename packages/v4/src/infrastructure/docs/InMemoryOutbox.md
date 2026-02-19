# InMemoryOutbox

> In-process `Outbox` implementation that converts domain events and rejections to integration events and buffers them in memory.

## What it is

`InMemoryOutbox` is the standard implementation of [`Outbox`](./Outbox.md). It stores
[`OutboxEntry`](./OutboxEntry.md) instances in a plain array and converts incoming
[`DomainEvent`](../../domain/docs/DomainEvent.md) or
[`Rejection`](../../domain/docs/Rejection.md) values to
[`IntegrationEvent`](./IntegrationEvent.md) at enqueue time via
`convertDomainEventToIntegrationEvent` or `convertRejectionToIntegrationEvent`.

The four operations map directly to the [`Outbox`](./Outbox.md) interface:

- **`enqueue(event)`** — detects whether the input is a `Rejection` (via `isRejection`) and
  selects the appropriate converter, then wraps the result in an `OutboxEntry` via
  `createOutboxEntry`.
- **`getPending(limit?)`** — filters out already-published entries and returns up to `limit`
  (default 100).
- **`markAsPublished(id)`** — sets `entry.published = true`; silently no-ops if the id is not
  found.
- **`markAsFailed(id)`** — increments `entry.retryCount` and records `entry.lastAttemptAt` via
  `getTimestamp()`; silently no-ops if the id is not found.

`entries` and `idCounter` are `protected` to allow subclassing in tests or specialised scenarios.

## Usage

```typescript
import { GenericOutboxWorker } from '@infrastructure/Outbox/implementations/GenericOutboxWorker.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'

const outbox = new InMemoryOutbox()
const worker = new GenericOutboxWorker(outbox, eventBus, 'users')

// Enqueue after a command handler produces a domain event:
await outbox.enqueue(userCreatedEvent)

// Worker drains pending entries:
await worker.runOnce()
```

## Related

- **Interface**: [`Outbox`](./Outbox.md)
- **Worker**: [`GenericOutboxWorker`](./GenericOutboxWorker.md)
- **Tests**: [`Outbox.spec.ts`](../Outbox/Outbox.spec.ts)
- **Depends on**: [`OutboxEntry`](./OutboxEntry.md), [`IntegrationEvent`](./IntegrationEvent.md)
