# Maybe

> A union type representing a value that may be absent — `T | null | undefined`.

## What it is

`Maybe<T>` is the conventional way to express an optional value that could be
either present (`T`), explicitly absent (`null`), or uninitialised (`undefined`).
It is a single-line alias that communicates intent clearly in function signatures
and return types, replacing the wordier `T | null | undefined` union everywhere
it appears.

In a **clean architecture** the application layer frequently deals with values
that may not exist — an aggregate that has not been created yet, a query result
with no match, an optional configuration field. `Maybe<T>` makes that
optionality explicit at the call site and forces callers to handle all three
cases before using the value, eliminating implicit `undefined` bugs without
requiring a full `Option`/`Result` monad.

For cases where only `null` is needed (e.g. database fields that are explicitly
set to null, as distinct from missing), see [`Nullable<T>`](./Nullable.md).

## Interface

```typescript
export type Maybe<T> = T | null | undefined
```

## Usage

```typescript
import type { Maybe } from '@core/types/Maybe.ts'

interface UserRepository {
  findById(id: string): Promise<Maybe<User>>
}

async function getUser(id: string): Promise<User> {
  const user = await repository.findById(id)

  if (user == null) {
    throw new Error(`User ${id} not found`)
  }

  return user // narrowed to User
}
```

## Related

- **See also**: [`Nullable`](./Nullable.md), [`Primitive`](./Primitive.md)
