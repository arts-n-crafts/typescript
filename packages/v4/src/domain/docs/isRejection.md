# isRejection

> Type guard that narrows an unknown value to `Rejection`.

## What it is

`isRejection` is the runtime type guard for [`Rejection`](./Rejection.md)
values. It is intentionally independent of [`isEvent`](./isEvent.md) — rather
than delegating to a broad structural check, it identifies rejections by their
exclusive fields: `commandId`, `commandType`, `reasonCode`, and `timestamp`.
These four fields are present on every `Rejection` and absent from every
[`DomainEvent`](./DomainEvent.md), making them reliable discriminators without
needing to check the `kind` property.

This design reflects the **SOLID** Open/Closed Principle: the set of event
kinds can expand without changing `isRejection`, because it does not depend on
an exhaustive `kind` switch or a shared base check.

The primary use case is in `CommandHandler` and `Decider` result handling, where
`decide()` returns `TEvent[] | Rejection`. Calling `isRejection(result)` at the
call site gives TypeScript a fully narrowed type on both branches:

```
if (isRejection(result))   → Rejection  (route to Outbox)
else                        → TEvent[]   (route to EventStore)
```

This mirrors the `Result<T, E>` pattern from functional programming, keeping
both success and failure as plain values rather than exceptions.

## Interface

```typescript
export function isRejection(candidate: unknown): candidate is Rejection
```

## Usage

Handling the result of a `decide()` call in a `CommandHandler`:

```typescript
import { isRejection } from '@domain/utils/isRejection.ts'

const result = User.decide(command, state)

if (isRejection(result)) {
  await this.outbox.enqueue(result) // publish as IntegrationEvent outcome='rejected'
}
else {
  await this.repository.store(result) // save events to EventStore
}
```

## Related

- **Tests**: [`isRejection.spec.ts`](../utils/isRejection.spec.ts)
- **See also**: [`isEvent`](./isEvent.md), [`isDomainEvent`](./isDomainEvent.md),
  [`createRejection`](./createRejection.md)
- **Used by**: [`Decider`](./Decider.md),
  [`ScenarioTest`](../../infrastructure/docs/ScenarioTest.md),
  command handlers
