# createExternalEvent

> Factory function that constructs a fully-formed, frozen `ExternalEvent` object.

## What it is

`createExternalEvent` is the counterpart to
[`createIntegrationEvent`](./createIntegrationEvent.md) for the inbound
direction. It constructs an [`ExternalEvent`](./ExternalEvent.md) with the same
freeze-and-stamp pattern: a generated `id` (UUID), an ISO 8601 `timestamp`, and
`kind: 'external'` set automatically.

In production code, external events typically arrive pre-formed from a message
broker or HTTP adapter — the adapter deserialises the raw payload and wraps it
in an `ExternalEvent`. `createExternalEvent` is therefore most useful in two
contexts:

- **Test helpers**: constructing realistic `ExternalEvent` fixtures in specs
  or [`ScenarioTest`](./ScenarioTest.md) `.given()` / `.when()` calls.
- **Typed named factories**: wrapping `createExternalEvent` in a named factory
  per event type (same convention as `createIntegrationEvent`) so that each
  external event has a typed constructor — see Usage.

## Interface

```typescript
export function createExternalEvent<TPayload = unknown>(
  type: string,
  payload: TPayload,
  metadata?: Partial<ExternalEventMetadata>,
): ExternalEvent<TPayload>
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

## Related

- **Tests**: [`ExternalEvent.spec.ts`](../EventBus/ExternalEvent.spec.ts)
- **See also**: [`createIntegrationEvent`](./createIntegrationEvent.md),
  [`isExternalEvent`](./isExternalEvent.md)
- **Used by**: [`ExternalEvent`](./ExternalEvent.md),
  [`ScenarioTest`](./ScenarioTest.md), test helpers
