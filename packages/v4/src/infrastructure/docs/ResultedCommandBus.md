# ResultedCommandBus

> Exception-free command router that wraps every outcome in a `Result<void, Error>`.

## What it is

`ResultedCommandBus` is the `oxide.ts`-flavoured implementation of
[`CommandBus`](./CommandBus.md). It has the same routing logic as
[`SimpleCommandBus`](./SimpleCommandBus.md) — a `Map` from command type strings to
[`CommandHandler`](../../core/docs/CommandHandler.md) instances — but never throws. Every
error condition is returned as `Err(error)`:

- **Double registration** — `register` returns `Err` instead of throwing.
- **Missing handler** — `execute` returns `Err` instead of throwing.
- **Successful execution** — `execute` returns `Ok(undefined)`.

This makes error handling explicit and composable with the `Result` pattern used throughout the
`Resulted*` implementations.

## Usage

```typescript
import { ResultedCommandBus } from '@infrastructure/CommandBus/implementations/ResultedCommandBus.ts'

const bus = new ResultedCommandBus<UserCommand>()

const registered = bus.register('CreateUser', createUserHandler)
if (registered.isErr()) {
  console.error(registered.unwrapErr())
}

const result = await bus.execute({ type: 'CreateUser', payload: { name: 'Alice' } })
if (result.isErr()) {
  console.error(result.unwrapErr())
}
```

## Related

- **Interface**: [`CommandBus`](./CommandBus.md)
- **Pair**: [`SimpleCommandBus`](./SimpleCommandBus.md)
- **Tests**: [`ResultedCommandBus.spec.ts`](../CommandBus/implementations/ResultedCommandBus.spec.ts)
- **Depends on**: [`CommandHandler`](../../core/docs/CommandHandler.md)
