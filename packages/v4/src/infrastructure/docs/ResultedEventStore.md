# ResultedEventStore

> Exception-free event store implementation that wraps all outcomes in `Result` types.

## What it is

`ResultedEventStore` is the `oxide.ts`-flavoured implementation of [`EventStore`](./EventStore.md).
It has the same logic as [`SimpleEventStore`](./SimpleEventStore.md) — storing
[`DomainEvent`](../../domain/docs/DomainEvent.md) instances as
[`StoredEvent`](./StoredEvent.md) envelopes and optionally enqueuing to an
[`Outbox`](./Outbox.md) — but never throws. Every error condition is returned as `Err`:

- **Multiple aggregates in one append** — returns `Err(new MultipleAggregatesException())` instead
  of throwing.
- **Successful append** — returns `Ok({ id: aggregateId })`.
- **Successful load** — returns `Ok(domainEvents[])`.

Both `load` and `append` require a `ResultedDatabase` as their `Database` dependency, since query
results are themselves `Result`-typed and must be unwrapped before use.

## Usage

```typescript
import { ResultedEventStore } from '@infrastructure/EventStore/implementations/ResultedEventStore.ts'

const eventStore = new ResultedEventStore(resultedDatabase, outbox)

// Replay history:
const loaded = await eventStore.load('users', aggregateId)
const events = loaded.unwrap()

// Persist new events:
const appended = await eventStore.append('users', [userCreatedEvent])
if (appended.isErr()) {
  console.error(appended.unwrapErr())
}
```

## Related

- **Interface**: [`EventStore`](./EventStore.md)
- **Pair**: [`SimpleEventStore`](./SimpleEventStore.md)
- **Tests**: [`ResultedEventStore.spec.ts`](../EventStore/implementations/ResultedEventStore.spec.ts)
- **Depends on**: [`ResultedDatabase`](./ResultedDatabase.md), [`Outbox`](./Outbox.md), [`StoredEvent`](./StoredEvent.md)
