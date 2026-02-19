# convertDomainEventToIntegrationEvent

> Converts an internal `DomainEvent` into an `IntegrationEvent` ready for external publishing.

## What it is

`convertDomainEventToIntegrationEvent` is the bridge between the internal domain
model and the external wire contract. A [`DomainEvent`](./DomainEvent.md) is a
fact that lives within the bounded context — it uses millisecond timestamps, has
`kind: 'domain'`, and carries `aggregateId`/`aggregateType` as first-class
fields. An [`IntegrationEvent`](../../infrastructure/docs/IntegrationEvent.md)
is the external envelope published to message brokers, audit logs, or monitoring
systems — it uses ISO timestamps, has `kind: 'integration'`, and places routing
fields in `metadata`.

The conversion is intentionally thin: the `type` and `payload` pass through
unchanged, so downstream consumers see the same event name and data they would
expect. The metadata is enriched with `outcome: 'accepted'` (signalling the
command was accepted and state changed), plus `aggregateType` and `aggregateId`
for routing and correlation.

This function is one half of the **Outbox** pattern: the
[`Outbox`](../../infrastructure/docs/Outbox.md) calls it when dequeuing a domain
event for external delivery, converting the internal fact into the stable external
schema before publishing via the
[`EventBus`](../../infrastructure/docs/EventBus.md). The companion function
[`convertRejectionToIntegrationEvent`](./convertRejectionToIntegrationEvent.md)
handles the failure branch — same envelope, `outcome: 'rejected'`.

Keeping the conversion in a dedicated function, rather than inside the Outbox
itself, separates concerns: the Outbox manages delivery guarantees; this function
owns the schema mapping. This follows the **Single Responsibility Principle**.

## Interface

```typescript
export function convertDomainEventToIntegrationEvent(event: DomainEvent): IntegrationEvent
```

## Usage

In an `OutboxWorker` or `CommandHandler` after saving events:

```typescript
import { convertDomainEventToIntegrationEvent } from '@domain/utils/convertDomainEventToIntegrationEvent.ts'

for (const event of domainEvents) {
  const integrationEvent = convertDomainEventToIntegrationEvent(event)
  await eventBus.publish(integrationEvent)
}
```

The resulting `IntegrationEvent` will have:

| Field | Value |
|---|---|
| `type` | same as `DomainEvent.type` |
| `payload` | same as `DomainEvent.payload` |
| `kind` | `'integration'` |
| `metadata.outcome` | `'accepted'` |
| `metadata.aggregateType` | from `DomainEvent.aggregateType` |
| `metadata.aggregateId` | from `DomainEvent.aggregateId` |

## Related

- **Tests**: [`convertDomainEventToIntegrationEvent.spec.ts`](../utils/convertDomainEventToIntegrationEvent.spec.ts)
- **See also**: [`convertRejectionToIntegrationEvent`](./convertRejectionToIntegrationEvent.md),
  [`createIntegrationEvent`](../../infrastructure/docs/createIntegrationEvent.md)
- **Used by**: [`Outbox`](../../infrastructure/docs/Outbox.md),
  [`OutboxWorker`](../../infrastructure/docs/OutboxWorker.md)
