# isIntegrationEvent

> Type guard that narrows an unknown value to `IntegrationEvent<TPayload>`.

## What it is

`isIntegrationEvent` is the runtime type guard for
[`IntegrationEvent`](./IntegrationEvent.md) values. It follows the same
two-step pattern as [`isDomainEvent`](../../domain/docs/isDomainEvent.md):
delegate the broad structural check to [`isEvent`](../../domain/docs/isEvent.md),
then confirm `kind === 'integration'`.

The guard is generic — callers can assert a specific payload type at the call
site (`isIntegrationEvent<UserCreatedPayload>(msg)`), though this is an
unchecked assertion at runtime. The `kind` check is the only runtime
discriminator; payload shape is TypeScript's concern.

The primary use case is in [`EventBus`](./EventBus.md) subscribers and
integration-event consumers that receive unknown messages and need to confirm
they are looking at an outbound integration envelope before accessing
`metadata.outcome` or other integration-specific fields.

## Interface

```typescript
export function isIntegrationEvent<TPayload>(event: unknown): event is IntegrationEvent<TPayload>
```

## Usage

In an event bus subscriber:

```typescript
import { isIntegrationEvent } from '@infrastructure/EventBus/utils/isIntegrationEvent.ts'

function onMessage(message: unknown): void {
  if (isIntegrationEvent(message) && message.metadata.outcome === 'accepted') {
    // message is narrowed to IntegrationEvent
    logger.info('Accepted event received', { type: message.type })
  }
}
```

## Related

- **Tests**: [`IntegrationEvent.spec.ts`](../EventBus/IntegrationEvent.spec.ts)
- **See also**: [`isEvent`](../../domain/docs/isEvent.md),
  [`isDomainEvent`](../../domain/docs/isDomainEvent.md),
  [`isExternalEvent`](./isExternalEvent.md)
- **Used by**: [`EventBus`](./EventBus.md), event bus subscribers
