# Primitive

> A union of all JavaScript primitive types.

## What it is

`Primitive` names the complete set of JavaScript non-object, non-function
values: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, and
`undefined`. Using this alias in place of the full union makes type signatures
shorter and intent explicit — "this field holds a plain scalar value, not an
object or array."

In this library `Primitive` appears as the value type in
[`QueryNode`](../../../domain/Specification/docs/QueryNode.md) — the
serialisable predicate tree produced by
[`Specification`](../../../domain/docs/Specification.md). Comparison
predicates (`eq`, `gt`, `lt`) compare a field against a `Primitive`, which
keeps `QueryNode` fully serialisable to JSON (no object references) and
therefore portable across **hexagonal architecture** boundaries (e.g.
translatable to a SQL `WHERE` clause, a MongoDB filter, or an in-memory
predicate).

## Interface

```typescript
export type Primitive = string | number | boolean | bigint | symbol | null | undefined
```

## Usage

```typescript
import type { Primitive } from '@core/types/Primitive.ts'

// Accept any scalar comparison value
function eq(field: string, value: Primitive): QueryNode {
  return { type: 'eq', field, value }
}

eq('status', 'active') // ✅ string
eq('age', 30) // ✅ number
eq('verified', true) // ✅ boolean
eq('score', { avg: 5 }) // ✗ compile error — object is not Primitive
```

## Related

- **Used by**: [`QueryNode`](../../../domain/docs/Specification.md),
  [`FieldEquals`](../../../domain/Specification/implementations/),
  [`createQueryNode`](../../../domain/Specification/utils/)
- **See also**: [`Maybe`](./Maybe.md), [`Nullable`](./Nullable.md)
