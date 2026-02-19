# createIntegrationEvent

> Factory function that constructs a fully-formed, frozen `IntegrationEvent` object.

## What it is

`createIntegrationEvent` is the standard way to instantiate an
[`IntegrationEvent`](./IntegrationEvent.md). It follows the same
freeze-and-stamp pattern as
[`createDomainEvent`](../../domain/docs/createDomainEvent.md) and
[`createCommand`](../../core/docs/createCommand.md), generating an `id` (UUID)
and setting `kind: 'integration'`, so callers only supply business-meaningful
fields.

One key difference from the domain-layer factories: the `timestamp` is produced
with `new Date().toISOString()` rather than
[`getTimestamp()`](../../core/docs/getTimestamp.md). This gives an
[`ISODateTime`](../../core/docs/types/ISODateTime.md) string suitable for
external consumers, rather than the millisecond epoch number used internally.

The signature is intentionally minimal — just `type`, `payload`, and optional
`metadata`. Routing fields like `aggregateType`, `aggregateId`, `commandType`,
and `outcome` are passed via the `metadata` parameter. This keeps the factory
generic and lets the two conversion utilities
([`convertDomainEventToIntegrationEvent`](../../domain/docs/convertDomainEventToIntegrationEvent.md),
[`convertRejectionToIntegrationEvent`](../../domain/docs/convertRejectionToIntegrationEvent.md))
populate exactly the metadata fields they need.

## Interface

```typescript
export function createIntegrationEvent<TPayload = unknown>(
  type: string,
  payload: TPayload,
  metadata?: Partial<IntegrationEventMetadata>,
): IntegrationEvent<TPayload>
```

## Usage

Typically wrapped in a named factory per event type:

```typescript
import type { IntegrationEvent, IntegrationEventMetadata } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { createIntegrationEvent } from '@infrastructure/EventBus/utils/createIntegrationEvent.ts'

export interface CreateUserRejectedPayload {
  userEmail: string
}

export function createUserRejected(
  props: CreateUserRejectedPayload,
  metadata?: Partial<IntegrationEventMetadata>,
): IntegrationEvent<CreateUserRejectedPayload> {
  return createIntegrationEvent('CreateUserRejected', props, metadata)
}
```

Or called directly by a conversion utility:

```typescript
// inside convertDomainEventToIntegrationEvent
return createIntegrationEvent(event.type, event.payload, {
  outcome: 'accepted',
  aggregateType: event.aggregateType,
  aggregateId: event.aggregateId,
})
```

## Related

- **See also**: [`createExternalEvent`](./createExternalEvent.md),
  [`createDomainEvent`](../../domain/docs/createDomainEvent.md)
- **Used by**: [`IntegrationEvent`](./IntegrationEvent.md),
  [`convertDomainEventToIntegrationEvent`](../../domain/docs/convertDomainEventToIntegrationEvent.md),
  [`convertRejectionToIntegrationEvent`](../../domain/docs/convertRejectionToIntegrationEvent.md)
