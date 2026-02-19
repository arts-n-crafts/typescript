# ExternalEvent

> An immutable notification received from another bounded context or third-party system.

## What it is

An `ExternalEvent` represents a fact that originated *outside* this service —
produced by another bounded context, a third-party API, or a message broker your
service subscribes to. Examples: `PaymentSettled` from a payment provider,
`ContractSigned` from a partner service, `ProductCreated` from an upstream
catalogue service.

Understanding what an `ExternalEvent` is *not* clarifies its role:

- **Not a [`DomainEvent`](../../domain/docs/DomainEvent.md)** — your service did
  not produce it and does not own the aggregate it describes. You have no
  authority to reinterpret or mutate its meaning.
- **Not an [`IntegrationEvent`](./IntegrationEvent.md)** — `IntegrationEvent` is
  what *this* service publishes outward; `ExternalEvent` is what this service
  *receives* inward. The `kind` discriminators make the direction explicit:
  `'integration'` (outbound) vs `'external'` (inbound).

In **hexagonal architecture** terms, `ExternalEvent` is the input port payload
for the event consumer adapter. Your service's event handler receives an
`ExternalEvent`, and the application layer decides what to do with it — typically
translating it into an internal [`Command`](../../core/docs/Command.md) (driving
a saga) or ignoring it. This translation is the **Anti-Corruption Layer (ACL)**
pattern: external concepts are converted to internal language at the boundary
rather than leaking into the domain.

`ExternalEventMetadata` extends [`BaseMetadata`](../../core/docs/types/BaseMetadata.md)
but adds no extra fields — the producer's metadata is carried through as-is,
with `schemaVersion` available for consumers to detect schema changes from
upstream. The `id` is treated as opaque: it is assigned by the producer and used
locally for idempotency checks, not as an internal identity.

## Interface

```typescript
export interface ExternalEventMetadata extends BaseMetadata {}

export interface ExternalEvent<TPayload = unknown> {
  id: string
  type: string
  payload: TPayload
  timestamp: ISODateTime
  metadata?: Partial<ExternalEventMetadata>
  kind: 'external'
}
```

## Usage

Define a typed external event factory (from `examples/CreateContractSigned.ts`):

```typescript
import type { ExternalEvent, ExternalEventMetadata } from '@infrastructure/EventBus/ExternalEvent.ts'
import { createExternalEvent } from '@infrastructure/EventBus/utils/createExternalEvent.ts'

export interface ContractSignedPayload {
  userId: string
  product: '1' | '2' | '3'
}

export function createContractSigned(
  props: ContractSignedPayload,
  metadata?: Partial<ExternalEventMetadata>,
): ExternalEvent<ContractSignedPayload> {
  return createExternalEvent('createContractSigned', props, metadata)
}

export type ContractSignedEvent = ReturnType<typeof createContractSigned>
```

Handling an external event in an event handler:

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

- **Examples**: [`CreateContractSigned.ts`](../EventBus/examples/CreateContractSigned.ts),
  [`ProductCreated.ts`](../EventBus/examples/ProductCreated.ts)
- **Tests**: [`ExternalEvent.spec.ts`](../EventBus/ExternalEvent.spec.ts)
- **Utils**: [`createExternalEvent`](./createExternalEvent.md),
  [`isExternalEvent`](./isExternalEvent.md)
- **Used by**: [`EventBus`](./EventBus.md),
  [`ScenarioTest`](./ScenarioTest.md)
- **Contrast with**: [`IntegrationEvent`](./IntegrationEvent.md),
  [`DomainEvent`](../../domain/docs/DomainEvent.md)
