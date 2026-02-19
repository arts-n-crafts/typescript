# ResultedEventBus

> Exception-free event bus that collects all handler failures into an `AggregateError` and returns them as `Err`.

## What it is

`ResultedEventBus` is the `oxide.ts`-flavoured implementation of
[`EventBus`](./EventBus.md). It has the same fan-out routing as
[`SimpleEventBus`](./SimpleEventBus.md) — a `Map` from stream names to arrays of
[`EventHandler`](../../core/docs/EventHandler.md) instances — but never throws.

The key difference is error collection: each handler is wrapped in `Result.safe()`, so a failing
handler does not short-circuit the others. After all handlers settle, any errors are gathered into
an `AggregateError` and returned as `Err`. This ensures all subscribers always receive the event,
even if some fail.

Return types:

- `subscribe` — `Result<void, never>` (always succeeds)
- `consume` / `publish` — `Promise<Result<void, Error>>`; `Err` carries an `AggregateError` if
  one or more handlers failed, `Ok(undefined)` otherwise

## Usage

```typescript
import { ResultedEventBus } from '@infrastructure/EventBus/implementations/ResultedEventBus.ts'

const bus = new ResultedEventBus<UserEvent>()

bus.subscribe('users', userProjectionHandler)
bus.subscribe('users', auditLogHandler)

const result = await bus.publish('users', userCreatedEvent)
if (result.isErr()) {
  // AggregateError — one or more handlers failed
  console.error(result.unwrapErr())
}
```

## Related

- **Interface**: [`EventBus`](./EventBus.md)
- **Pair**: [`SimpleEventBus`](./SimpleEventBus.md)
- **Tests**: [`ResultedEventBus.spec.ts`](../EventBus/implementations/ResultedEventBus.spec.ts)
- **Depends on**: [`EventHandler`](../../core/docs/EventHandler.md)
