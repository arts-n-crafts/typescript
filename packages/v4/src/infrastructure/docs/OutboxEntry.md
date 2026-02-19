# OutboxEntry

> A single record in the outbox buffer — a converted `IntegrationEvent` with delivery state.

## What it is

`OutboxEntry` is what the [`Outbox`](./Outbox.md) stores after calling
`enqueue`. By the time a `DomainEvent` or `Rejection` becomes an `OutboxEntry`,
it has already been converted to an [`IntegrationEvent`](./IntegrationEvent.md)
— the external wire format. The entry then tracks delivery state:

- **`published`** — `true` once `markAsPublished` is called; `getPending`
  filters these out.
- **`retryCount`** — incremented on each failed publish attempt by `markAsFailed`.
- **`lastAttemptAt`** — epoch milliseconds of the most recent attempt, for
  retry backoff logic.

`OutboxEntry` is an internal infrastructure type — it never surfaces in the
domain or application layers.

## Interface

```typescript
export interface OutboxEntry {
  id: string
  event: IntegrationEvent
  published: boolean
  retryCount: number
  lastAttemptAt?: number
}
```

## Related

- **Tests**: [`OutboxEntry.spec.ts`](../Outbox/OutboxEntry.spec.ts)
- **Used by**: [`Outbox`](./Outbox.md), [`OutboxWorker`](./OutboxWorker.md)
