# SimpleCommandBus

> In-memory command router that dispatches commands to registered handlers and throws on error.

## What it is

`SimpleCommandBus` is the standard implementation of [`CommandBus`](./CommandBus.md). It maintains
a `Map` from command `type` strings to [`CommandHandler`](../../core/docs/CommandHandler.md)
instances and dispatches each incoming command to its registered handler.

Error cases surface as thrown `Error` instances:

- **Double registration** — calling `register` for a type that already has a handler throws
  immediately, preventing silent overwrites.
- **Missing handler** — calling `execute` for an unregistered command type throws, making routing
  gaps visible at runtime.

Use `SimpleCommandBus` when you want straightforward `async/await` error propagation via
exceptions. For typed, exception-free error handling see
[`ResultedCommandBus`](./ResultedCommandBus.md).

## Usage

```typescript
import { SimpleCommandBus } from '@infrastructure/CommandBus/implementations/SimpleCommandBus.ts'

const bus = new SimpleCommandBus<UserCommand>()

bus.register('CreateUser', createUserHandler)
bus.register('DeleteUser', deleteUserHandler)

await bus.execute({ type: 'CreateUser', payload: { name: 'Alice' } })
```

## Related

- **Interface**: [`CommandBus`](./CommandBus.md)
- **Pair**: [`ResultedCommandBus`](./ResultedCommandBus.md)
- **Tests**: [`SimpleCommandBus.spec.ts`](../CommandBus/implementations/SimpleCommandBus.spec.ts)
- **Depends on**: [`CommandHandler`](../../core/docs/CommandHandler.md)
