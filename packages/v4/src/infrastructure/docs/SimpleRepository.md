# SimpleRepository

> Concrete `Repository` that replays events through a `Decider`'s `evolve` function to reconstruct state, and appends new events via an `EventStore`.

## What it is

`SimpleRepository` is the standard implementation of the domain
[`Repository`](../../domain/docs/Repository.md) port. It wires a
[`Decider`](../../domain/docs/Decider.md)'s pure functions to the
[`EventStore`](./EventStore.md), giving the application layer a clean `load`/`store` interface
over event-sourced aggregates.

**Construction** takes four arguments:

| Parameter | Type | Purpose |
|-----------|------|---------|
| `eventStore` | `EventStore<TEvent>` | Persistence layer for the event stream |
| `streamName` | `string` | The stream name for this aggregate type (e.g. `'users'`) |
| `evolveFn` | `Decider['evolve']` | Pure `(state, event) → state` fold function |
| `initialState` | `Decider['initialState']` | Factory for the aggregate's empty starting state |

**`load(aggregateId)`** — calls `eventStore.load(streamName, aggregateId)` then folds the returned
events through `evolveFn` starting from `initialState(aggregateId)`, returning the reconstructed
`TState`.

**`store(events)`** — appends each event individually to the `EventStore` via `Promise.all`,
one `append` call per event (each is already scoped to a single aggregate).

## Usage

```typescript
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'

const repository = new SimpleRepository(
  eventStore,
  'users',
  User.evolve,
  User.initialState,
)

const state = await repository.load(aggregateId)
await repository.store([userCreatedEvent])
```

## Related

- **Interface**: [`Repository`](../../domain/docs/Repository.md)
- **Pair**: [`ResultedRepository`](./ResultedRepository.md)
- **Tests**: [`SimpleRepository.spec.ts`](../Repository/implementations/SimpleRepository.spec.ts)
- **Depends on**: [`EventStore`](./EventStore.md), [`Decider`](../../domain/docs/Decider.md)
