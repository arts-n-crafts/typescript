# SimpleEventStore

> Append-only event store implementation that persists domain events to a `Database` and enqueues them to an optional `Outbox`.

## What it is

`SimpleEventStore` is the standard implementation of [`EventStore`](./EventStore.md). It stores
[`DomainEvent`](../../domain/docs/DomainEvent.md) instances as
[`StoredEvent`](./StoredEvent.md) envelopes in an `event_store` table via the
[`Database`](./Database.md) port, and replays them on `load` to reconstruct aggregate history.

**`load(streamName, aggregateId)`** — queries the database using a `FieldEquals` specification on
`streamKey` (`${streamName}#${aggregateId}`), then unwraps the `StoredEvent` envelopes and returns
the plain `DomainEvent[]`.

**`append(streamName, events)`** — enforces single-aggregate writes (throws
`MultipleAggregatesException` if events span more than one `aggregateId`), loads the current
stream to determine the starting `version`, creates `StoredEvent` wrappers via `createStoredEvent`,
and persists them concurrently. If an [`Outbox`](./Outbox.md) was injected, each event is also
enqueued after writing.

The version counter is derived from the current stream length — each new event gets
`currentStream.length + 1`. This is a simple optimistic version that works correctly for
single-writer scenarios.

## Usage

```typescript
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'

const eventStore = new SimpleEventStore(database, outbox)

// Replay history:
const events = await eventStore.load('users', aggregateId)

// Persist new events:
await eventStore.append('users', [userCreatedEvent])
```

## Related

- **Interface**: [`EventStore`](./EventStore.md)
- **Pair**: [`ResultedEventStore`](./ResultedEventStore.md)
- **Tests**: [`SimpleEventStore.spec.ts`](../EventStore/implementations/SimpleEventStore.spec.ts)
- **Depends on**: [`Database`](./Database.md), [`Outbox`](./Outbox.md), [`StoredEvent`](./StoredEvent.md)
