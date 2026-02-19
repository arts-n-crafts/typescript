# convertRejectionToIntegrationEvent

> Converts a `Rejection` into an `IntegrationEvent` ready for external publishing.

## What it is

`convertRejectionToIntegrationEvent` is the companion to
[`convertDomainEventToIntegrationEvent`](./convertDomainEventToIntegrationEvent.md).
Together they cover the two branches of a [`Decider`](./Decider.md)'s result:
accepted commands produce domain events (converted with `outcome: 'accepted'`);
rejected commands produce a [`Rejection`](./Rejection.md) (converted here with
`outcome: 'rejected'`). Both produce the same
[`IntegrationEvent`](../../infrastructure/docs/IntegrationEvent.md) envelope,
so downstream consumers (Kafka, audit logs, monitoring) can handle both outcomes
through a single subscription.

The mapping differs from the accepted path in two meaningful ways:

- **`type`** is set to `rejection.commandType` rather than `rejection.type`.
  Downstream consumers typically route on the command name (`'CreateUser'`) and
  filter by `metadata.outcome`, rather than routing on the derived rejection
  name (`'CreateUserRejected'`). This keeps routing logic uniform regardless of
  outcome.

- **`payload`** merges `rejection.details` with the `reasonCode`. Consumers
  receive both the original data from the failed command (via `details`) and the
  machine-readable reason for the failure in a single flat object — avoiding the
  need to reconstruct the failure context from separate fields.

`aggregateType` and `aggregateId` are sourced from `rejection.metadata` (not
top-level fields) because a `Rejection` may be produced before the aggregate
exists, making those fields optional.

## Interface

```typescript
export function convertRejectionToIntegrationEvent(rejection: Rejection): IntegrationEvent
```

## Usage

In an `OutboxWorker` or `CommandHandler` after a rejection:

```typescript
import { convertRejectionToIntegrationEvent } from '@domain/utils/convertRejectionToIntegrationEvent.ts'

const integrationEvent = convertRejectionToIntegrationEvent(rejection)
await eventBus.publish(integrationEvent)
```

The resulting `IntegrationEvent` will have:

| Field | Value |
|---|---|
| `type` | `rejection.commandType` (e.g. `'CreateUser'`) |
| `payload` | `{ ...rejection.details, reasonCode: rejection.reasonCode }` |
| `kind` | `'integration'` |
| `metadata.outcome` | `'rejected'` |
| `metadata.commandType` | from `rejection.commandType` |
| `metadata.commandId` | from `rejection.commandId` |
| `metadata.aggregateType` | from `rejection.metadata.aggregateType` |
| `metadata.aggregateId` | from `rejection.metadata.aggregateId` |

## Related

- **Tests**: [`convertRejectionToIntegrationEvent.spec.ts`](../utils/convertRejectionToIntegrationEvent.spec.ts)
- **See also**: [`convertDomainEventToIntegrationEvent`](./convertDomainEventToIntegrationEvent.md),
  [`createIntegrationEvent`](../../infrastructure/docs/createIntegrationEvent.md)
- **Used by**: [`Outbox`](../../infrastructure/docs/Outbox.md),
  [`OutboxWorker`](../../infrastructure/docs/OutboxWorker.md)
