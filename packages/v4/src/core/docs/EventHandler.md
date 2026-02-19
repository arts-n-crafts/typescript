# EventHandler

> The contract for a handler that reacts to an event — domain, integration, or external.

## What it is

`EventHandler` is the interface for any object that subscribes to the
[`EventBus`](../../infrastructure/docs/EventBus.md) and reacts to events. It
accepts all three event kinds — [`DomainEvent`](../../domain/docs/DomainEvent.md),
[`IntegrationEvent`](../../infrastructure/docs/IntegrationEvent.md), and
[`ExternalEvent`](../../infrastructure/docs/ExternalEvent.md) — making it the
single interface for every event-driven use case in the system.

Two patterns emerge from the examples:

**Projection handlers** — react to `DomainEvent`s by updating a read model.
They receive the event from the bus, check its type, and write to a
[`Database`](../../infrastructure/docs/Database.md). This is the read-side
update in **CQRS/Event Sourcing**: every state change on the write side
propagates to the read model via the event bus and a projection handler.

**Process/saga handlers** — react to `ExternalEvent`s or `IntegrationEvent`s
by issuing new [`Command`](./Command.md)s. The
[`ContractSignedHandler`](../examples/ContractSignedHandler.ts) example receives
an external `ContractSigned` event and dispatches an `ActivateUser` command via
the [`CommandBus`](../../infrastructure/docs/CommandBus.md). This is the
**Anti-Corruption Layer (ACL)** pattern: external events are translated into
internal commands at the boundary.

The `handle` method receives the full `DomainEvent | IntegrationEvent |
ExternalEvent` union. Handlers typically add a private narrowing method (e.g.
`isUserCreatedEvent`) to check `event.type` before acting, keeping the narrowing
local and readable.

Like [`CommandHandler`](./CommandHandler.md) and [`QueryHandler`](./QueryHandler.md),
`EventHandler` follows the **SOLID** Open/Closed Principle — adding a new
reaction to an event means adding a new handler class and subscribing it on the
bus, not modifying any existing handler.

## Interface

```typescript
export interface EventHandler<
  TEvent extends DomainEvent | IntegrationEvent | ExternalEvent,
  TReturnType = Promise<void>,
> {
  handle(anEvent: TEvent): TReturnType
}
```

## Usage

A projection handler (from `examples/UserCreatedEventHandler.ts`):

```typescript
import type { EventHandler } from '@core/EventHandler.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { createUserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'

export class UserCreatedEventHandler implements EventHandler<UserCreatedEvent> {
  constructor(private readonly repository: Repository<UserEvent, Promise<UserState>, Promise<void>>) {}

  isUserCreatedEvent(
    anEvent: DomainEvent | IntegrationEvent | ExternalEvent,
  ): anEvent is UserCreatedEvent {
    return anEvent.type === 'UserCreated'
  }

  async handle(anEvent: DomainEvent | IntegrationEvent | ExternalEvent): Promise<void> {
    if (this.isUserCreatedEvent(anEvent)) {
      const emailSentEvent = createUserRegistrationEmailSent(
        anEvent.aggregateId,
        { status: 'SUCCESS' },
        { causationId: anEvent.id },
      )
      await this.repository.store([emailSentEvent])
    }
  }
}
```

An ACL / saga handler that translates an external event into a command (from `examples/ContractSignedHandler.ts`):

```typescript
export class ContractSignedHandler implements EventHandler<ContractSignedEvent> {
  constructor(private readonly commandBus: CommandBus<UserCommand>) {}

  async handle(anEvent: DomainEvent | IntegrationEvent | ExternalEvent): Promise<void> {
    if (anEvent.type === 'createContractSigned') {
      const command = createActivateUserCommand(anEvent.payload.userId, {})
      await this.commandBus.execute(command)
    }
  }
}
```

## Related

- **Examples**: [`UserCreatedEventHandler.ts`](../examples/UserCreatedEventHandler.ts),
  [`ContractSignedHandler.ts`](../examples/ContractSignedHandler.ts)
- **Tests**: [`UserCreatedEventHandler.spec.ts`](../examples/UserCreatedEventHandler.spec.ts),
  [`ContractSignedHandler.spec.ts`](../examples/ContractSignedHandler.spec.ts)
- **Used by**: [`EventBus`](../../infrastructure/docs/EventBus.md),
  [`ScenarioTest`](../../infrastructure/docs/ScenarioTest.md)
- **Contrast with**: [`CommandHandler`](./CommandHandler.md),
  [`QueryHandler`](./QueryHandler.md)
