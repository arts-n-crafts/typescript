# Nullable

> A mapped type that makes every property of `T` accept `null`.

## What it is

`Nullable<T>` transforms an object type so that every one of its properties can
hold either its original value or `null`. This is distinct from
[`Maybe<T>`](./Maybe.md), which operates on a single value and includes
`undefined`; `Nullable<T>` operates on all properties of an object and adds
only `null`.

The distinction maps to a real database concern: SQL columns that are
`NOT NULL` versus columns that allow `NULL`. When modelling a record that
arrives from a database — where some columns may be `null` by design —
`Nullable<T>` faithfully represents that shape without widening every value
to also accept `undefined`. This keeps the type honest and prevents
accidental confusion between "column is null in the database" and "property
was never set in JavaScript".

In a **hexagonal architecture**, `Nullable<T>` typically appears at the
infrastructure boundary — in repository return types and database adapters —
rather than inside the domain, where values should be fully resolved before
being passed inward.

## Interface

```typescript
export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}
```

## Usage

```typescript
import type { Nullable } from '@core/types/Nullable.ts'

interface UserRecord {
  id: string
  name: string
  deletedAt: string
}

// A row from the database where deletedAt may be NULL
type UserRow = Nullable<UserRecord>
// → { id: string | null; name: string | null; deletedAt: string | null }

// More commonly, apply only to the nullable columns:
type UserRow = Omit<UserRecord, 'deletedAt'> & Nullable<Pick<UserRecord, 'deletedAt'>>
// → { id: string; name: string; deletedAt: string | null }
```

## Related

- **See also**: [`Maybe`](./Maybe.md), [`Primitive`](./Primitive.md)
