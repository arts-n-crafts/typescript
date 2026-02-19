# isEvent

> Type guard that narrows an unknown value to `DomainEvent | IntegrationEvent | ExternalEvent`.

## What it is

`isEvent` is the broad, structural runtime type guard for all event kinds in the
library. It answers the question: "is this value shaped like an event at all?"
It does not distinguish which _kind_ of event; that is left to the narrower
guards — [`isDomainEvent`](./isDomainEvent.md),
[`isIntegrationEvent`](../../infrastructure/docs/isIntegrationEvent.md), and
[`isExternalEvent`](../../infrastructure/docs/isExternalEvent.md) — which all
call `isEvent` first and then apply kind-specific conditions.

The guard performs four lightweight property checks in order:

1. The value is an object (not a primitive).
2. The value is not `null`.
3. The value has a `type` string property.
4. The value has a `kind` discriminator property.

These checks are intentionally minimal. Exhaustive validation of every field
would duplicate type information already enforced by the TypeScript compiler at
compile time. At runtime the guard's only job is to prevent unguarded property
access on unknown values flowing in from the
[`EventBus`](../../infrastructure/docs/EventBus.md) or external I/O boundaries.

The separation of `isEvent` (broad) from the narrower guards follows the
**SOLID** Interface Segregation Principle: code that only needs to know
"something is an event" (for example, a generic event logger or a middleware
that attaches trace IDs) depends on the minimal `isEvent` check and nothing
more. Code that needs domain-specific fields uses the appropriate narrower guard.

Note: [`Rejection`](./Rejection.md) has both `type` and `kind` fields and would
pass the structural checks, but it is intentionally excluded from the return
type union. A rejection is not an event — it is a refused command decision.

## Interface

```typescript
export function isEvent(event: unknown): event is DomainEvent | IntegrationEvent | ExternalEvent
```

## Usage

In a generic event middleware or logger:

```typescript
import { isEvent } from '@domain/utils/isEvent.ts'

function onMessage(message: unknown): void {
  if (!isEvent(message)) {
    logger.warn('Received non-event message', { message })
    return
  }
  // message is narrowed to DomainEvent | IntegrationEvent | ExternalEvent
  logger.info('Received event', { type: message.type, kind: message.kind })
}
```

In a narrower guard that delegates to `isEvent` first:

```typescript
import type { DomainEvent } from '@domain/DomainEvent.ts'
import { isEvent } from './isEvent.ts'

export function isDomainEvent(event: unknown): event is DomainEvent {
  return isEvent(event)
    && 'aggregateId' in event
    && event.kind === 'domain'
}
```

## Related

- **Tests**: [`isEvent.spec.ts`](../utils/isEvent.spec.ts)
- **See also**: [`isDomainEvent`](./isDomainEvent.md),
  [`isIntegrationEvent`](../../infrastructure/docs/isIntegrationEvent.md),
  [`isExternalEvent`](../../infrastructure/docs/isExternalEvent.md),
  [`isRejection`](./isRejection.md)
- **Used by**: [`isDomainEvent`](./isDomainEvent.md), projection handlers,
  event middleware
