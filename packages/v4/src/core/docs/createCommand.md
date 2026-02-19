# createCommand

> Factory function that constructs a fully-formed, frozen `Command` object.

## What it is

`createCommand` is the standard way to instantiate a [`Command`](./Command.md).
It stamps the command with a generated `id` (UUID), a `timestamp` (milliseconds
since epoch), and the `kind: 'command'` discriminator, so that call sites only
need to supply the business-meaningful fields: type, aggregate identity, payload,
and optional metadata.

Returning a frozen object (`Object.freeze`) enforces immutability — commands are
**value objects** in **DDD** terms. Once created, a command's intent and payload
cannot be mutated, which prevents accidental modification as the object flows
through the application layer towards a [`CommandBus`](../../infrastructure/docs/CommandBus.md).

The factory follows the **Factory Method** pattern and the **SOLID** Single
Responsibility Principle: construction logic (id generation, timestamping,
freezing) lives in one place rather than being repeated at every command
creation site.

The conventional usage pattern is to wrap `createCommand` in a named factory
function for each command type, producing a typed constructor that serves as
the public API for that command (see Usage below).

## Interface

```typescript
export function createCommand<TType extends string, TPayload>(
  type: TType,
  aggregateId: string,
  aggregateType: string,
  payload: TPayload,
  metadata?: Partial<CommandMetadata>,
): Command<TType, TPayload>
```

## Usage

Define a typed command factory (from `examples/CreateUser.ts`):

```typescript
import type { Command, CommandMetadata } from '@core/Command.ts'
import { createCommand } from '@core/utils/createCommand.ts'

export interface CreateUserProps {
  name: string
  email: string
  age?: number
}

export function createRegisterUserCommand(
  aggregateId: string,
  payload: CreateUserProps,
  metadata?: Partial<CommandMetadata>,
): Command<'CreateUser', CreateUserProps> {
  return createCommand('CreateUser', aggregateId, 'User', payload, metadata)
}
```

Then at the call site:

```typescript
const cmd = createRegisterUserCommand(randomUUID(), {
  name: 'Alice',
  email: 'alice@example.com',
})

await commandBus.execute(cmd)
```

## Related

- **Examples**: [`CreateUser.ts`](../examples/CreateUser.ts)
- **Tests**: [`createCommand.spec.ts`](../utils/createCommand.spec.ts)
- **Utils**: [`getTimestamp`](./getTimestamp.md), [`isCommand`](./isCommand.md)
- **Used by**: [`Command`](./Command.md),
  [`CommandBus`](../../infrastructure/docs/CommandBus.md)
