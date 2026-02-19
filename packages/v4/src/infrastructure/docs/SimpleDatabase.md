# SimpleDatabase

> In-memory `Database` implementation backed by a `Map`, with per-operation error throwing and an offline simulation helper.

## What it is

`SimpleDatabase` is the standard implementation of [`Database`](./Database.md). It stores records
in a `Map<string, TModel[]>` keyed by table name, with no external dependencies. All four
[`Operation`](./Database.md) variants are supported:

| Operation | Behaviour | Error thrown |
|-----------|-----------|--------------|
| `CREATE`  | Appends the record | `DuplicateRecordException` if `id` already exists |
| `PUT`     | Replaces the record entirely | `RecordNotFoundException` if `id` not found |
| `PATCH`   | Merges partial payload into existing record | `RecordNotFoundException` if `id` not found |
| `DELETE`  | Removes the record by `id` | `RecordNotFoundException` if `id` not found |

`query` filters all records in the table through `specification.isSatisfiedBy(record)` — the
sans-I/O bridge between the `Specification` pattern and in-memory storage.

**`goOffline()`** is a test helper that puts the database into a mode where every `execute` and
`query` call throws `DatabaseOfflineException`, making it easy to simulate infrastructure
failures in unit tests without mocking.

`TModel` is constrained to `WithIdentifier` — every stored record must have an `id` field.

## Usage

```typescript
import { Operation } from '@infrastructure/Database/Database.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'

const db = new SimpleDatabase<User>()

await db.execute('users', { operation: Operation.CREATE, payload: user })
await db.execute('users', { operation: Operation.PATCH, payload: { id: user.id, email: 'new@example.com' } })

const results = await db.query('users', new ActiveUserSpecification())

// Simulate offline for testing:
db.goOffline()
```

## Related

- **Interface**: [`Database`](./Database.md)
- **Pair**: [`ResultedDatabase`](./ResultedDatabase.md)
- **Tests**: [`SimpleDatabase.spec.ts`](../Database/implementations/SimpleDatabase.spec.ts)
- **Used by**: [`SimpleEventStore`](./SimpleEventStore.md)
