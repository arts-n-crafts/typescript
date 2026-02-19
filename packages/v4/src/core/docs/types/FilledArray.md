# FilledArray

> A tuple type that guarantees an array of records contains at least one element.

## What it is

`FilledArray` is a TypeScript tuple type that encodes a non-empty array
constraint at the type level. A plain `Record<string, unknown>[]` allows an
empty array; `FilledArray` does not — the first element is required, and zero
or more additional elements may follow.

This matters in **sans-I/O** and **clean architecture** contexts where passing
an empty collection to an operation like a batch insert, a bulk publish, or a
group assertion is either a programming error or a no-op that wastes an I/O
round-trip. Expressing the constraint in the type prevents the caller from ever
passing an empty array, making the impossible state unrepresentable — a core
TypeScript design principle.

```
type FilledArray = [first, ...rest]
                    ^^^^^  ^^^^^^
                    required  zero or more
```

## Interface

```typescript
export type FilledArray = [Record<string, unknown>, ...Record<string, unknown>[]]
```

## Usage

```typescript
import type { FilledArray } from '@core/types/FilledArray.ts'

function batchInsert(records: FilledArray): Promise<void> {
  // TypeScript guarantees records.length >= 1 — no defensive empty-check needed
}

// ✅ valid
batchInsert([{ id: '1', name: 'Alice' }])
batchInsert([{ id: '1' }, { id: '2' }])

// ✗ compile error — argument of type '[]' is not assignable to FilledArray
batchInsert([])
```

## Related

- **See also**: [`Maybe`](./Maybe.md), [`Nullable`](./Nullable.md)
