# isEqual

> Recursively compares two values for deep structural equality.

## What it is

`isEqual` is a dependency-free deep-equality check. It compares primitives by
value (`===`) and objects/arrays recursively by structure, returning `true` only
when both values have the same keys, same arity, and the same deeply-equal
values at every node.

In an **Event Sourcing / sans-I/O** context, equality checks on plain objects
are a first-class concern: `ScenarioTest` uses `isEqual` to verify that
expected events, commands, and query results match their actual counterparts
without requiring domain objects to implement custom `equals()` methods or
extend any base class. Keeping comparison logic as a pure function with no side
effects is consistent with the **sans-I/O** and **SOLID** principles that run
through this library — comparison is a utility concern, not an object behaviour.

Note: `isEqual` does a shallow-key comparison (`Object.keys`) and recurses into
values. It handles `null`, `undefined`, primitives, plain objects, and arrays.
It does not handle `Date`, `Map`, `Set`, or circular references — keep domain
payloads as plain data objects.

## Interface

```typescript
export function isEqual<T>(a: T, b: T): boolean
```

## Usage

```typescript
import { isEqual } from '@utils/isEqual/isEqual.ts'

isEqual(1, 1) // true
isEqual({ id: 'a' }, { id: 'a' }) // true
isEqual({ id: 'a' }, { id: 'b' }) // false
isEqual([1, { x: 2 }], [1, { x: 2 }]) // true
isEqual([1, { x: 2 }], [1, { x: 3 }]) // false
```

## Related

- **Tests**: [`isEqual.spec.ts`](../isEqual.spec.ts)
- **Used by**: [`ScenarioTest`](../../../infrastructure/docs/ScenarioTest.md)
