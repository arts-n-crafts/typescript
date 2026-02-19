# BaseMetadata

> A shared metadata envelope carried by every message in the system.

## What it is

`BaseMetadata` is the standard metadata contract attached to `Command`,
`Query`, `DomainEvent`, `IntegrationEvent`, and `ExternalEvent`. It captures
the *context* around a message rather than its business payload: who issued it,
why it was issued, and how it fits into a larger distributed flow.

All fields are optional to keep adoption friction low — a simple command needs
nothing more than its payload — but each field serves a precise cross-cutting
concern:

| Field | Purpose |
|-------|---------|
| `correlationId` | End-to-end trace across services for a single user action |
| `causationId` | Immediate cause of this message (usually the previous message's id) |
| `traceId` | Distributed tracing identifier (e.g. OpenTelemetry trace id) |
| `schemaVersion` | Payload schema version, enabling backwards-compatible evolution |
| `tenantId` | Tenant isolation in multi-tenant systems |
| `userId` | Actor who triggered the action (audit, authorisation) |
| `source` | Producing service name, e.g. `"orders-service"` |
| `[key: string]` | Open index signature for additive, domain-specific extensions |

In a **hexagonal / clean architecture** this metadata belongs at the *port*
boundary — it is infra-level context that flows alongside domain messages
without polluting domain logic. The index signature (`[key: string]: unknown`)
follows the **Open/Closed Principle**: consumers can extend metadata for their
own needs (e.g. `featureFlags`, `requestId`) without modifying the core
interface.

Propagating `correlationId` and `causationId` across service calls enables
end-to-end observability in an **Event-Driven Architecture**, turning a chain
of independent messages into a traceable causal graph.

## Interface

```typescript
export interface BaseMetadata {
  correlationId?: string
  causationId?: string
  traceId?: string
  schemaVersion?: number
  tenantId?: string
  userId?: string
  source?: string
  [key: string]: unknown
}
```

## Usage

```typescript
import type { BaseMetadata } from '@core/types/BaseMetadata.ts'

// Attaching metadata when creating a command
const cmd = createCommand('CreateOrder', payload, {
  correlationId: requestId,
  userId: currentUser.id,
  source: 'orders-service',
})

// Propagating causation from an incoming event to a new command
const followUpCmd = createCommand('SendConfirmationEmail', emailPayload, {
  correlationId: incomingEvent.metadata.correlationId,
  causationId: incomingEvent.id,
})
```

## Related

- **Used by**: [`Command`](../Command.md), [`Query`](../Query.md),
  [`DomainEvent`](../../domain/docs/DomainEvent.md),
  [`Rejection`](../../domain/docs/Rejection.md),
  [`IntegrationEvent`](../../infrastructure/docs/IntegrationEvent.md),
  [`ExternalEvent`](../../infrastructure/docs/ExternalEvent.md)
