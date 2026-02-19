# isExternalEvent

> Type guard that narrows an unknown value to `ExternalEvent<TPayload>`.

## What it is

`isExternalEvent` is the runtime type guard for
[`ExternalEvent`](./ExternalEvent.md) values. It follows exactly the same
two-step pattern as [`isIntegrationEvent`](./isIntegrationEvent.md) and
[`isDomainEvent`](../../domain/docs/isDomainEvent.md): delegate to
[`isEvent`](../../domain/docs/isEvent.md) for the broad structural check, then
confirm `kind === 'external'`.

Like `isIntegrationEvent`, it is generic — callers can assert a specific payload
type at the call site, though that assertion is not verified at runtime.

The typical use case is in [`EventBus`](./EventBus.md) subscribers that receive
unknown inbound messages and need to confirm they are handling an external
notification before translating it into an internal
[`Command`](../../core/docs/Command.md).

## Interface

```typescript
export function isExternalEvent<TPayload>(event: unknown): event is ExternalEvent<TPayload>
```

## Usage

In an event bus subscriber that translates external events into commands:

```typescript
import { isExternalEvent } from '@infrastructure/EventBus/utils/isExternalEvent.ts'

function onMessage(message: unknown): void {
  if (isExternalEvent(message) && message.type === 'ContractSigned') {
    // translate to an internal command — Anti-Corruption Layer
    const command = createActivateUserCommand(message.payload.userId)
    commandBus.execute(command)
  }
}
```

## Related

- **Tests**: [`ExternalEvent.spec.ts`](../EventBus/ExternalEvent.spec.ts)
- **See also**: [`isEvent`](../../domain/docs/isEvent.md),
  [`isIntegrationEvent`](./isIntegrationEvent.md),
  [`isDomainEvent`](../../domain/docs/isDomainEvent.md)
- **Used by**: [`EventBus`](./EventBus.md), event bus subscribers
