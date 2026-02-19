# ResultedRepository

> Exception-free `Repository` that wraps `load` and `store` outcomes in `Result` types.

## What it is

`ResultedRepository` is the `oxide.ts`-flavoured implementation of the domain
[`Repository`](../../domain/docs/Repository.md) port. It has the same event-replay and
append logic as [`SimpleRepository`](./SimpleRepository.md) — folding events through a
[`Decider`](../../domain/docs/Decider.md)'s `evolve` function on `load`, and writing via
[`EventStore`](./EventStore.md) on `store` — but returns `Result`-wrapped values instead of
throwing.

Return types:

- **`load`** — `Promise<Result<TState, Error>>`; unwraps the `Result<TEvent[], Error>` from the
  underlying `ResultedEventStore`, folds, and returns `Ok(state)`.
- **`store`** — `Promise<Result<{ id: string }, Error>>`; appends all events then returns
  `Ok({ id: aggregateId })` on success.

`ResultedRepository` requires a `ResultedEventStore` as its `EventStore` dependency, since it
directly unwraps `Result`-typed load responses.

## Usage

```typescript
import { ResultedRepository } from '@infrastructure/Repository/implementations/ResultedRepository.ts'

const repository = new ResultedRepository(
  resultedEventStore,
  'users',
  User.evolve,
  User.initialState,
)

const loaded = await repository.load(aggregateId)
const state = loaded.unwrap()

const stored = await repository.store([userCreatedEvent])
if (stored.isErr()) {
  console.error(stored.unwrapErr())
}
```

## Related

- **Interface**: [`Repository`](../../domain/docs/Repository.md)
- **Pair**: [`SimpleRepository`](./SimpleRepository.md)
- **Tests**: [`ResultedRepository.spec.ts`](../Repository/implementations/ResultedRepository.spec.ts)
- **Depends on**: [`ResultedEventStore`](./ResultedEventStore.md), [`Decider`](../../domain/docs/Decider.md)
