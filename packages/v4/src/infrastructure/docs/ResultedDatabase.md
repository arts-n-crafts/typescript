# ResultedDatabase

> Exception-free in-memory `Database` implementation that returns `Result<{ id: string }, Error>` from every write and `Result<TModel[], Error>` from every query.

## What it is

`ResultedDatabase` is the `oxide.ts`-flavoured implementation of [`Database`](./Database.md). It
has the same in-memory `Map` storage and `goOffline()` test helper as
[`SimpleDatabase`](./SimpleDatabase.md), but never throws. Every error condition is returned as
`Err`:

| Condition | Returned |
|-----------|----------|
| `goOffline()` active | `Err(DatabaseOfflineException)` |
| `CREATE` with duplicate `id` | `Err(DuplicateRecordException)` |
| `PUT`/`PATCH`/`DELETE` with missing `id` | `Err(RecordNotFoundException)` |
| Any success | `Ok({ id })` from `execute`; `Ok(records[])` from `query` |

`execute` returns `Promise<Result<{ id: string }, Error>>` — on success the affected record's `id`
is returned inside `Ok`, giving callers a confirmation without needing to re-query.

`ResultedDatabase` is the required `Database` dependency for
[`ResultedEventStore`](./ResultedEventStore.md), since that store unwraps `Result`-typed query
responses directly.

## Usage

```typescript
import { Operation } from '@infrastructure/Database/Database.ts'
import { ResultedDatabase } from '@infrastructure/Database/implementations/ResultedDatabase.ts'

const db = new ResultedDatabase<User>()

const created = await db.execute('users', { operation: Operation.CREATE, payload: user })
if (created.isErr()) {
  console.error(created.unwrapErr()) // DuplicateRecordException
}

const queried = await db.query('users', new ActiveUserSpecification())
const users = queried.unwrap()
```

## Related

- **Interface**: [`Database`](./Database.md)
- **Pair**: [`SimpleDatabase`](./SimpleDatabase.md)
- **Tests**: [`ResultedDatabase.spec.ts`](../Database/implementations/ResultedDatabase.spec.ts)
- **Used by**: [`ResultedEventStore`](./ResultedEventStore.md)
