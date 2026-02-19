# Database

> The persistence port that abstracts record storage and retrieval behind a typed command/query interface.

## What it is

`Database` is the infrastructure persistence abstraction in the **Ports & Adapters** (hexagonal)
architecture. Application and domain code depend on the `Database` interface, never on a concrete
storage technology. Swapping an in-memory implementation for a real database requires only a new
adapter, not changes to the caller.

The interface combines two narrower contracts:

- **`Executable`** — write-side mutations: `execute(tableName, statement)` is overloaded for four
  `Operation` variants (CREATE, PUT, PATCH, DELETE). Each variant carries a typed `Statement`
  payload, making illegal operations (e.g. a PATCH without an `id`) a compile-time error.
- **`QueryAble`** — read-side retrieval: `query(collectionName, specification)` accepts a
  [`CompositeSpecification`](../../domain/docs/Specification.md) and returns matching records. The
  Specification is the sans-I/O boundary — predicates are defined without database knowledge and
  translated to a storage query by the adapter.

The four `Statement` types encode the semantics of each operation:

| Operation | Payload constraint | Semantics |
|-----------|-------------------|-----------|
| `CREATE`  | `TModel` | Insert a new record |
| `PUT`     | `TModel` | Replace an existing record entirely |
| `PATCH`   | `WithIdentifier<Partial<TModel>>` | Partial update — `id` is required, all other fields optional |
| `DELETE`  | `WithIdentifier` | Remove by `id` only |

## Interface

```typescript
export enum Operation {
  CREATE = 'CREATE',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface CreateStatement<TModel> {
  operation: Operation.CREATE
  payload: TModel
}

export interface PutStatement<TModel> {
  operation: Operation.PUT
  payload: TModel
}

export interface PatchStatement<TModel> {
  operation: Operation.PATCH
  payload: WithIdentifier<Partial<TModel>>
}

export interface DeleteStatement {
  operation: Operation.DELETE
  payload: WithIdentifier
}

export interface Database<
  TModel,
  TExecuteReturnType = Promise<void>,
  TQueryReturnType = Promise<TModel[]>,
> {
  execute(tableName: string, statement: CreateStatement<TModel>): TExecuteReturnType
  execute(tableName: string, statement: PutStatement<TModel>): TExecuteReturnType
  execute(tableName: string, statement: PatchStatement<TModel>): TExecuteReturnType
  execute(tableName: string, statement: DeleteStatement): TExecuteReturnType
  query(collectionName: string, specification: CompositeSpecification<TModel>): TQueryReturnType
}
```

## Usage

```typescript
import { Operation } from '@infrastructure/Database/Database.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'

const db = new SimpleDatabase<User>()

// Insert a record:
await db.execute('users', { operation: Operation.CREATE, payload: user })

// Partial update:
await db.execute('users', { operation: Operation.PATCH, payload: { id: user.id, email: 'new@example.com' } })

// Delete by id:
await db.execute('users', { operation: Operation.DELETE, payload: { id: user.id } })

// Query with a specification:
const activeUsers = await db.query('users', new ActiveUserSpecification())
```

## Related

- **Implementations**: [`SimpleDatabase`](./SimpleDatabase.md), [`ResultedDatabase`](./ResultedDatabase.md)
- **Tests**: [`SimpleDatabase.spec.ts`](../Database/implementations/SimpleDatabase.spec.ts)
- **Used by**: [`EventStore`](./EventStore.md), [`QueryHandler`](../../core/docs/QueryHandler.md), [`EventHandler`](../../core/docs/EventHandler.md)
- **Depends on**: [`CompositeSpecification`](../../domain/docs/Specification.md), [`WithIdentifier`](../../core/docs/types/WithIdentifier.md)
