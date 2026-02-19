# createDomainEvent

> Factory function that constructs a fully-formed, frozen `DomainEvent` object.

## What it is

`createDomainEvent` is the standard way to instantiate a
[`DomainEvent`](./DomainEvent.md). It follows the same pattern as
[`createCommand`](../../core/docs/createCommand.md) and
[`createQuery`](../../core/docs/createQuery.md): it stamps the event with a
generated `id` (UUID), a `timestamp` (milliseconds since epoch via
[`getTimestamp`](../../core/docs/getTimestamp.md)), and the `kind: 'domain'`
discriminator, so that event factory functions only need to supply the
business-meaningful fields: type, aggregate identity, payload, and optional
metadata.

Returning a frozen object enforces immutability — domain events are facts that
cannot change after they are created. This is central to **Event Sourcing**:
the event stream is an append-only ledger of what happened, and each entry
must be stable.

The conventional usage pattern is to wrap `createDomainEvent` in a named
factory per event type, co-located with the event's payload type definition
(see Usage). This keeps each event's construction logic in one place and
provides a typed constructor that serves as the public API for that event.

## Interface

```typescript
export function createDomainEvent<TPayload = unknown>(
  type: string,
  aggregateId: string,
  aggregateType: string,
  payload: TPayload,
  metadata?: Partial<DomainEventMetadata>,
): DomainEvent<TPayload>
```

## Usage

Define a typed event factory (from `examples/UserCreated.ts`):

```typescript
import type { DomainEvent, DomainEventMetadata } from '@domain/DomainEvent.ts'
import { createDomainEvent } from '@domain/utils/createDomainEvent.ts'

export interface UserCreatedPayload {
  name: string
  email: string
  age?: number
  prospect: boolean
}

export function createUserCreatedEvent(
  aggregateId: string,
  payload: Omit<UserCreatedPayload, 'prospect'>,
  metadata?: Partial<DomainEventMetadata>,
): DomainEvent<UserCreatedPayload> {
  return createDomainEvent('UserCreated', aggregateId, 'User', { prospect: true, ...payload }, metadata)
}
```

Then inside a `Decider.decide()`:

```typescript
return [createUserCreatedEvent(command.aggregateId, command.payload)]
```

## Related

- **Examples**: [`UserCreated.ts`](../examples/UserCreated.ts),
  [`UserNameUpdated.ts`](../examples/UserNameUpdated.ts)
- **Utils**: [`getTimestamp`](../../core/docs/getTimestamp.md),
  [`isDomainEvent`](./isDomainEvent.md)
- **Used by**: [`DomainEvent`](./DomainEvent.md),
  [`Decider`](./Decider.md)
