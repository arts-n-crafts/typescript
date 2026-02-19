# QueryHandler

> The contract for the application layer object that processes a query and returns read data.

## What it is

`QueryHandler` is the read-side counterpart to
[`CommandHandler`](./CommandHandler.md) in **CQRS**. It receives one specific
[`Query`](./Query.md) type, reads from a
[`Database`](../../infrastructure/docs/Database.md) or other read model, and
returns a result — by default `Promise<unknown>`, but typed precisely via the
`TProjection` parameter.

Where `CommandHandler` orchestrates writes (load state → decide → persist),
`QueryHandler` is purely a read: no aggregate is loaded, no events are emitted,
no state changes. This separation is fundamental to **CQRS** — the read side is
entirely independent of the write side and can use a completely different storage
model (a denormalised projection table, a search index, a cache) optimised for
querying rather than event sourcing.

The handler uses a [`Specification`](../../domain/docs/Specification.md) to
express filter criteria in terms of the domain model, which the
[`Database`](../../infrastructure/docs/Database.md) implementation translates to
its underlying storage query. This keeps query logic portable across storage
backends and maintains the **sans-I/O** principle: the filter criteria are
expressed as plain value objects, not raw SQL or query DSL.

Like `CommandHandler`, implementing `QueryHandler<TQuery, TProjection>` makes
the contract explicit and allows the
[`QueryBus`](../../infrastructure/docs/QueryBus.md) to register and dispatch it
by query type — **SOLID** Open/Closed in action.

## Interface

```typescript
export interface QueryHandler<TQuery extends Query, TProjection = Promise<unknown>> {
  execute(aQuery: TQuery): TProjection
}
```

## Usage

A complete query handler (from `examples/GetUserByEmailHandler.ts`):

```typescript
import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { WithIdentifier } from '@core/types/WithIdentifier.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler
implements QueryHandler<GetUserByEmail, Promise<GetUserByEmailResult[]>> {
  constructor(
    private readonly database: Database<WithIdentifier<UserCreatedPayload>, Promise<void>, Promise<WithIdentifier<UserCreatedPayload>[]>>,
  ) {}

  async execute(aQuery: GetUserByEmail): Promise<GetUserByEmailResult[]> {
    const specification = new FieldEquals('email', aQuery.payload.email)
    return this.database.query('users', specification)
  }
}
```

Registered on the `QueryBus`:

```typescript
queryBus.register('GetUserByEmail', new GetUserByEmailHandler(database))
```

## Related

- **Examples**: [`GetUserByEmailHandler.ts`](../examples/GetUserByEmailHandler.ts)
- **Tests**: [`QueryHandler.spec.ts`](../QueryHandler.spec.ts)
- **Used by**: [`QueryBus`](../../infrastructure/docs/QueryBus.md),
  [`ScenarioTest`](../../infrastructure/docs/ScenarioTest.md)
- **Contrast with**: [`CommandHandler`](./CommandHandler.md),
  [`EventHandler`](./EventHandler.md)
