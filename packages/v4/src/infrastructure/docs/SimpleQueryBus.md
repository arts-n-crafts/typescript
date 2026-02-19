# SimpleQueryBus

> In-memory query router that dispatches queries to registered handlers and throws on error.

## What it is

`SimpleQueryBus` is the standard implementation of [`QueryBus`](./QueryBus.md). It maintains a
`Map` from query `type` strings to [`QueryHandler`](../../core/docs/QueryHandler.md) instances and
dispatches each incoming query to its registered handler, returning the projection directly.

Error cases surface as thrown `Error` instances:

- **Double registration** — calling `register` for a type that already has a handler throws
  immediately.
- **Missing handler** — calling `execute` for an unregistered query type throws.

The key difference from [`SimpleCommandBus`](./SimpleCommandBus.md) is the return type: `execute`
returns `Promise<TProjection>` — the query result — rather than `Promise<void>`. Both `TQuery` and
`TProjection` are generic parameters, so the bus is fully typed end-to-end.

Use `SimpleQueryBus` when you want straightforward `async/await` error propagation via exceptions.
For typed, exception-free error handling see [`ResultedQueryBus`](./ResultedQueryBus.md).

## Usage

```typescript
import { SimpleQueryBus } from '@infrastructure/QueryBus/implementations/SimpleQueryBus.ts'

const bus = new SimpleQueryBus<UserQuery, UserView>()

bus.register('GetUser', getUserHandler)

const user = await bus.execute({ type: 'GetUser', payload: { id: '123' } })
```

## Related

- **Interface**: [`QueryBus`](./QueryBus.md)
- **Pair**: [`ResultedQueryBus`](./ResultedQueryBus.md)
- **Tests**: [`SimpleQueryBus.spec.ts`](../QueryBus/implementations/SimpleQueryBus.spec.ts)
- **Depends on**: [`QueryHandler`](../../core/docs/QueryHandler.md)
