# isCommand

> Type guard that narrows an unknown value to `Command<string, unknown>`.

## What it is

`isCommand` is a runtime type guard for the [`Command`](./Command.md) interface.
It checks that a value is a non-null object with both a `type` field and a
`kind` field equal to `'command'`, then narrows the TypeScript type accordingly.

Type guards like `isCommand` are a **sans-I/O** / **hexagonal architecture**
pattern for working safely at system boundaries — places where an arbitrary
value arrives from outside the type system (e.g. a message bus, a webhook, an
event stream replay) and must be identified before being dispatched. Rather than
casting with `as Command`, `isCommand` makes the check explicit, auditable, and
testable.

The guard is intentionally narrow: it checks only the structural discriminants
(`type` and `kind: 'command'`), not the full shape of the payload. This is
enough for routing and dispatch decisions without coupling the guard to any
specific command's payload type.

## Interface

```typescript
export function isCommand(candidate: unknown): candidate is Command<string, unknown>
```

## Usage

```typescript
import { isCommand } from '@core/utils/isCommand.ts'

// In a multi-message dispatcher
function dispatch(message: unknown): void {
  if (isCommand(message)) {
    // message is narrowed to Command<string, unknown>
    return commandBus.execute(message)
  }

  if (isQuery(message)) {
    return queryBus.execute(message)
  }

  throw new Error(`Unknown message type: ${JSON.stringify(message)}`)
}
```

Also used internally by [`ScenarioTest`](../../infrastructure/docs/ScenarioTest.md)
to determine how to handle each step passed to `.when()`.

## Related

- **Tests**: [`isCommand.spec.ts`](../utils/isCommand.spec.ts)
- **See also**: [`createCommand`](./createCommand.md),
  [`isQuery`](./isQuery.md), [`Command`](./Command.md)
- **Used by**: [`ScenarioTest`](../../infrastructure/docs/ScenarioTest.md)
