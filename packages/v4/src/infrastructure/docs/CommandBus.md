# CommandBus

> Routes a command to its registered handler by command type.

## What it is

`CommandBus` is the infrastructure dispatcher for the command side of **CQRS**.
It decouples the sender of a command (e.g. an HTTP controller or a test) from
the [`CommandHandler`](../../core/docs/CommandHandler.md) that processes it.
Senders call `execute(command)` without knowing which handler is registered;
handlers are registered by command type string via `register(type, handler)`.

In **hexagonal architecture**, the `CommandBus` is an input-side mediator — it
lives at the boundary between the delivery mechanism (HTTP, message broker,
test) and the application layer. Controllers construct commands and hand them
to the bus; the bus routes to the correct handler. This means adding a new
command never touches existing handlers or controllers — only a new handler is
registered. This is the **SOLID** Open/Closed Principle applied to routing.

The interface is generic over three parameters:
- `TCommand` — the union of command types this bus handles
- `TExecutionResult` — return type of `execute` (defaults to `Promise<void>`; `ResultedCommandBus` uses `Promise<Result<void, Error>>`)
- `TRegisterResult` — return type of `register` (defaults to `void`)

Two implementations ship with the library:
- **`SimpleCommandBus`** — returns `Promise<void>`, throws on missing/duplicate handler
- **`ResultedCommandBus`** — returns `Promise<Result<void, Error>>` for typed error handling

## Interface

```typescript
export interface CommandBus<
  TCommand extends Command,
  TExecutionResult = Promise<void>,
  TRegisterResult = void,
> {
  register(aTypeOfCommand: TCommand['type'], anHandler: CommandHandler<TCommand>): TRegisterResult
  execute(aCommand: TCommand): TExecutionResult
}
```

## Usage

```typescript
import { SimpleCommandBus } from '@infrastructure/CommandBus/implementations/SimpleCommandBus.ts'

const commandBus = new SimpleCommandBus<UserCommand>()
commandBus.register('RegisterUser', new CreateUserHandler(repository, outbox))
commandBus.register('UpdateUserName', new UpdateUserNameHandler(repository))

// In a controller or test:
await commandBus.execute(createRegisterUserCommand(aggregateId, payload))
```

## Related

- **Implementations**: [`SimpleCommandBus`](./SimpleCommandBus.md),
  [`ResultedCommandBus`](./ResultedCommandBus.md)
- **Tests**: [`SimpleCommandBus.spec.ts`](../CommandBus/implementations/SimpleCommandBus.spec.ts),
  [`ResultedCommandBus.spec.ts`](../CommandBus/implementations/ResultedCommandBus.spec.ts)
- **Used by**: [`CommandHandler`](../../core/docs/CommandHandler.md),
  [`ScenarioTest`](./ScenarioTest.md)
- **Contrast with**: [`QueryBus`](./QueryBus.md), [`EventBus`](./EventBus.md)
