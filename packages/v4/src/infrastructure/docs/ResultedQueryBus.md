# ResultedQueryBus

> Exception-free query router that wraps every outcome in a `Result<TProjection, Error>`.

## What it is

`ResultedQueryBus` is the `oxide.ts`-flavoured implementation of [`QueryBus`](./QueryBus.md). It
has the same routing logic as [`SimpleQueryBus`](./SimpleQueryBus.md) — a `Map` from query type
strings to [`QueryHandler`](../../core/docs/QueryHandler.md) instances — but never throws. Every
error condition is returned as `Err(error)`:

- **Double registration** — `register` returns `Err` instead of throwing.
- **Missing handler** — `execute` returns `Err` instead of throwing.
- **Successful execution** — `execute` returns `Ok(projection)`.

Unlike `SimpleQueryBus`, `execute` returns `Promise<Result<TProjection, Error>>`, so callers must
unwrap the result to access the projection. This makes error handling explicit and composable with
the `Result` pattern used throughout the `Resulted*` implementations.

## Usage

```typescript
import { ResultedQueryBus } from '@infrastructure/QueryBus/implementations/ResultedQueryBus.ts'

const bus = new ResultedQueryBus<UserQuery, UserView>()

bus.register('GetUser', getUserHandler)

const result = await bus.execute({ type: 'GetUser', payload: { id: '123' } })
if (result.isOk()) {
  const user = result.unwrap()
}
```

## Related

- **Interface**: [`QueryBus`](./QueryBus.md)
- **Pair**: [`SimpleQueryBus`](./SimpleQueryBus.md)
- **Tests**: [`ResultedQueryBus.spec.ts`](../QueryBus/implementations/ResultedQueryBus.spec.ts)
- **Depends on**: [`QueryHandler`](../../core/docs/QueryHandler.md)
