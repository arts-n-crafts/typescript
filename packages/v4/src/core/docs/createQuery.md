# createQuery

> Factory function that constructs a fully-formed, frozen `Query` object.

## What it is

`createQuery` is the standard way to instantiate a [`Query`](./Query.md).
Parallel to [`createCommand`](./createCommand.md), it stamps the query with a
generated `id` (UUID), a `timestamp`, and the `kind: 'query'` discriminator so
that call sites only provide the business-meaningful fields: type, payload, and
optional metadata.

The key difference from `createCommand` is that a query carries no aggregate
identity — queries describe *what to read*, not *which aggregate to act on*.
The `payload` encodes the filter or search criteria (e.g. `{ email: 'alice@example.com' }`),
and the handler is responsible for translating that into a data access operation.

Like `createCommand`, the result is frozen to enforce immutability. Queries are
**value objects** in **DDD** — read-intent messages that must not be modified
after construction. This aligns with the **CQRS** principle that the read side
is separate from and independent of the write side: a query has no side effects
and can safely be retried, logged, or replayed.

The conventional pattern is to wrap `createQuery` in a named factory per query
type (see Usage below).

## Interface

```typescript
export function createQuery<TType extends string, TPayload>(
  type: TType,
  payload: TPayload,
  metadata?: QueryMetadata,
): Query<TType, TPayload>
```

## Usage

Define a typed query factory (from `examples/GetUserByEmail.ts`):

```typescript
import type { Query, QueryMetadata } from '@core/Query.ts'
import { createQuery } from '@core/utils/createQuery.ts'

export interface GetUserByEmailProps {
  email: string
}

export function createGetUserByEmailQuery(
  payload: GetUserByEmailProps,
  metadata?: Partial<QueryMetadata>,
): Query<'GetUserByEmail', GetUserByEmailProps> {
  return createQuery('GetUserByEmail', payload, metadata)
}
```

Then at the call site:

```typescript
const query = createGetUserByEmailQuery({ email: 'alice@example.com' })
const user = await queryBus.execute(query)
```

## Related

- **Examples**: [`GetUserByEmail.ts`](../examples/GetUserByEmail.ts)
- **Tests**: [`createQuery.spec.ts`](../utils/createQuery.spec.ts)
- **Utils**: [`getTimestamp`](./getTimestamp.md), [`isQuery`](./isQuery.md)
- **Used by**: [`Query`](./Query.md),
  [`QueryBus`](../../infrastructure/docs/QueryBus.md)
