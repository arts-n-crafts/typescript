# StoredEvent

> The persistence envelope that wraps a `DomainEvent` with stream coordinates and version.

## What it is

`StoredEvent<TEvent>` is what the [`EventStore`](./EventStore.md) actually
writes to the [`Database`](./Database.md). It wraps the original
[`DomainEvent`](../../domain/docs/DomainEvent.md) and adds the metadata needed
to store and retrieve it reliably:

- **`streamKey`** — the composite key `${streamName}#${aggregateId}` (a
  [`StreamKey`](../../utils/streamKey/docs/StreamKey.md)), used as the primary
  lookup field when loading an aggregate's event history.
- **`version`** — a monotonically increasing integer representing the
  aggregate's version after this event was applied. Used for optimistic
  concurrency control.
- **`timestamp`** — epoch milliseconds at write time, for ordering within a
  stream.
- **`id`** — the same id as the wrapped `DomainEvent`, preserving identity.
- **`event`** — the original `DomainEvent`, unchanged.

`StoredEvent` is an infrastructure concern — it never appears in the domain
layer. The `Repository` calls `EventStore.load`, which unwraps `StoredEvent`
envelopes and returns only the plain `DomainEvent[]` to the caller. This keeps
the domain free of storage metadata.

## Interface

```typescript
export interface StoredEvent<TEvent> {
  id: string
  streamKey: StreamKey
  version: number
  timestamp: number
  event: TEvent
}
```

## Usage

`StoredEvent` is constructed internally by the `EventStore` via
`createStoredEvent` and is never instantiated directly by application code:

```typescript
import { createStoredEvent } from '@infrastructure/EventStore/utils/createStoredEvent.ts'

const stored = createStoredEvent('users', currentVersion + 1, domainEvent)
// stored.streamKey === 'users#<aggregateId>'
// stored.version  === currentVersion + 1
// stored.event    === domainEvent
```

## Related

- **Tests**: [`StoredEvent.spec.ts`](../EventStore/StoredEvent.spec.ts)
- **Used by**: [`EventStore`](./EventStore.md), [`Database`](./Database.md)
- **See also**: [`StreamKey`](../../utils/streamKey/docs/StreamKey.md)
