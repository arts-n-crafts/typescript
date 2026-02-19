# QueryBus

> Routes a query to its registered handler by query type and returns the result.

## What it is

`QueryBus` is the read-side dispatcher in **CQRS**, the counterpart to
[`CommandBus`](./CommandBus.md). It routes a [`Query`](../../core/docs/Query.md)
to its registered [`QueryHandler`](../../core/docs/QueryHandler.md) and returns
the handler's result — typed via `TExecutionResult`.

The key difference from `CommandBus` is that `execute` returns a meaningful
value (`TExecutionResult`) rather than `Promise<void>`. The query bus is the
read side, so every `execute` call must return data. `TExecutionResult` has no
default — callers must always specify the return type explicitly, which is a
deliberate design choice to keep query results type-safe.

Like `CommandBus`, the bus decouples query senders from handlers, and adding
a new query type requires only registering a new handler — the sender is
unaffected (**SOLID** Open/Closed Principle).

Two implementations ship:
- **`SimpleQueryBus`** — returns `Promise<TProjection>`, throws on missing/duplicate handler
- **`ResultedQueryBus`** — returns `Promise<Result<TProjection, Error>>` for typed error handling

## Interface

```typescript
export interface QueryBus<
  TQuery extends Query,
  TExecutionResult,
  TRegisterResult = void,
> {
  register(aTypeOfQuery: TQuery['type'], anHandler: QueryHandler<TQuery>): TRegisterResult
  execute(aQuery: TQuery): TExecutionResult
}
```

## Usage

```typescript
import { SimpleQueryBus } from '@infrastructure/QueryBus/implementations/SimpleQueryBus.ts'

const queryBus = new SimpleQueryBus<GetUserByEmail, GetUserByEmailResult[]>()
queryBus.register('GetUserByEmail', new GetUserByEmailHandler(database))

// In a controller or test:
const results = await queryBus.execute(createGetUserByEmailQuery({ email: 'elon@x.com' }))
```

## Related

- **Implementations**: [`SimpleQueryBus`](./SimpleQueryBus.md),
  [`ResultedQueryBus`](./ResultedQueryBus.md)
- **Tests**: [`SimpleQueryBus.spec.ts`](../QueryBus/implementations/SimpleQueryBus.spec.ts),
  [`ResultedQueryBus.spec.ts`](../QueryBus/implementations/ResultedQueryBus.spec.ts)
- **Used by**: [`QueryHandler`](../../core/docs/QueryHandler.md),
  [`ScenarioTest`](./ScenarioTest.md)
- **Contrast with**: [`CommandBus`](./CommandBus.md), [`EventBus`](./EventBus.md)
