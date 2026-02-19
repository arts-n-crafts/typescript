# isQuery

> Type guard that narrows an unknown value to `Query<unknown>`.

## What it is

`isQuery` is a runtime type guard for the [`Query`](./Query.md) interface.
It checks that a value is a non-null object with both a `type` field and a
`kind` field equal to `'query'`, then narrows the TypeScript type accordingly.

Its structure and purpose mirror [`isCommand`](./isCommand.md) exactly — together
they form a pair of discriminant-based guards that allow a dispatcher or message
router to branch on message type without unsafe casts. This is the **CQRS**
separation made explicit at runtime: a message is either a command (write
intent) or a query (read intent), and the guards enforce that boundary.

Like `isCommand`, `isQuery` checks only the structural discriminants
(`type` and `kind: 'query'`), not the full payload shape, keeping it general
enough for use in any routing context.

## Interface

```typescript
export function isQuery(candidate: unknown): candidate is Query<unknown>
```

## Usage

```typescript
import { isCommand } from '@core/utils/isCommand.ts'
import { isQuery } from '@core/utils/isQuery.ts'

function dispatch(message: unknown): void {
  if (isCommand(message)) {
    return commandBus.execute(message)
  }

  if (isQuery(message)) {
    // message is narrowed to Query<unknown>
    return queryBus.execute(message)
  }

  throw new Error(`Unknown message type`)
}
```

Also used internally by [`ScenarioTest`](../../infrastructure/docs/ScenarioTest.md)
to route `.when()` steps to the correct bus.

## Related

- **Tests**: [`isQuery.spec.ts`](../utils/isQuery.spec.ts)
- **See also**: [`createQuery`](./createQuery.md),
  [`isCommand`](./isCommand.md), [`Query`](./Query.md)
- **Used by**: [`ScenarioTest`](../../infrastructure/docs/ScenarioTest.md)
