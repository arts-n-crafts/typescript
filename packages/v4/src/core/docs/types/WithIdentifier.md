# WithIdentifier

> An intersection type that adds a required `id: string` field to any object type.

## What it is

`WithIdentifier<T>` is a generic utility type that augments an existing type
`T` with a mandatory string `id`. It is the foundation of identity for every
message and aggregate in the library: a `Command`, `Query`, `DomainEvent`, and
database record all carry an `id` so they can be correlated, deduplicated, and
traced across system boundaries.

Expressing identity as a shared generic type rather than repeating `id: string`
in each interface is a **DRY** and **SOLID** (Open/Closed) practice — the
constraint is defined once and composed in. It also keeps the core message
types open for extension: pass any payload type `T` and get a fully identified
message back.

In a **vertical-slice / clean architecture**, the `id` on a command or event is
what allows the application layer to correlate a command to its resulting events,
and what the `EventStore` uses (via [`StreamKey`](../../../utils/streamKey/docs/StreamKey.md))
to locate the right aggregate stream.

## Interface

```typescript
export type WithIdentifier<T = object> = {
  id: string
} & T
```

## Usage

```typescript
import type { WithIdentifier } from '@core/types/WithIdentifier.ts'

// A query result that must carry an id
type UserRecord = WithIdentifier<{
  email: string
  name: string
}>
// → { id: string; email: string; name: string }

// Narrowing an unknown record to one with an id
function hasId(value: object): value is WithIdentifier {
  return 'id' in value && typeof (value as WithIdentifier).id === 'string'
}
```

## Related

- **Used by**: [`Command`](../Command.md), [`Query`](../Query.md),
  [`Database`](../../../infrastructure/docs/Database.md)
- **See also**: [`StreamKey`](../../../utils/streamKey/docs/StreamKey.md)
