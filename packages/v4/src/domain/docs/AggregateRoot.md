# AggregateRoot

> The OOP interface for a domain object that owns state, enforces invariants, and accumulates uncommitted events.

## What it is

`AggregateRoot` is the **DDD** object-oriented building block for a domain
entity that is the consistency boundary for a group of related objects. It
provides three guarantees:

- **Identity** — the aggregate has a stable `id` of type `TId`.
- **State** — the aggregate's current properties are accessible via `props`.
- **Uncommitted events** — mutations produce [`DomainEvent`](./DomainEvent.md)s
  that accumulate in `uncommittedEvents` until the
  [`Repository`](./Repository.md) saves them to the
  [`EventStore`](../../infrastructure/docs/EventStore.md) and clears the outbox.

The library provides two flavours via two interfaces:

**`AggregateRoot`** (state-based) — state is mutated directly in command
methods (`updateName`, etc.), which also push the corresponding event onto the
internal outbox. This is the classic OOP aggregate pattern.

**`EventBasedAggregateRoot`** (event-sourced) — extends `AggregateRoot` with
`fromEvents(events)`, which replays a sequence of stored events to rehydrate
state. The aggregate is constructed from the creation event, and subsequent
events are replayed through a private `apply` switch. This supports full **Event
Sourcing** with deterministic state reconstruction.

Note: `AggregateRoot` is an *OOP* pattern. The library also supports a purely
*functional* alternative via [`Decider`](./Decider.md) — pure `decide()` and
`evolve()` functions with no class. Both patterns coexist; choose based on team
preference and domain complexity.

## Interface

```typescript
export interface AggregateRoot<TId, TProps extends object, TEvent extends DomainEvent> {
  get id(): TId
  get props(): TProps
  get uncommittedEvents(): TEvent[]
}

export interface EventBasedAggregateRoot<TId, TProps extends object, TEvent extends DomainEvent>
  extends AggregateRoot<TId, TProps, TEvent> {
  fromEvents(events: TEvent[]): void
}
```

## Usage

State-based aggregate (from `examples/User.stateBased.ts`):

```typescript
import type { AggregateRoot } from '@domain/AggregateRoot.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'

export class User implements AggregateRoot<string, UserProps, UserEvent> {
  private readonly _id: string
  private readonly _props: UserProps
  private readonly outbox: UserEvent[] = []

  constructor(id: string, props: UserProps) {
    this._id = id
    this._props = props
    this.outbox.push(createUserCreatedEvent(id, props))
  }

  get id() { return this._id }
  get props() { return this._props }
  get uncommittedEvents() { return this.outbox }

  updateName(name: string): void {
    this._props.name = name
    this.outbox.push(createUserNameUpdatedEvent(this.id, { name }))
  }
}
```

Event-based aggregate (from `examples/User.eventBased.ts`):

```typescript
import type { EventBasedAggregateRoot } from '@domain/AggregateRoot.ts'

export class User implements EventBasedAggregateRoot<string, UserProps, UserEvent> {
  private _props: UserProps
  private readonly outbox: UserEvent[] = []

  constructor(event: DomainEvent<UserCreatedPayload>) {
    this._id = event.aggregateId
    this._props = event.payload
  }

  fromEvents(events: UserEvent[]): void {
    events.forEach(e => this.apply(e))
  }

  private apply(event: UserEvent): void {
    switch (event.type) {
      case 'UserNameUpdated': {
        this._props = { ...this._props, ...event.payload }
      }
    }
  }
}
```

## Related

- **Examples**: [`User.stateBased.ts`](../examples/User.stateBased.ts),
  [`User.eventBased.ts`](../examples/User.eventBased.ts)
- **Tests**: [`AggregateRoot.spec.ts`](../AggregateRoot.spec.ts)
- **Used by**: [`Repository`](./Repository.md)
- **Contrast with**: [`Decider`](./Decider.md) (functional alternative)
