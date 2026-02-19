# SimpleEventBus

> In-memory event bus that fans out published events to all subscribers on a stream and throws on handler errors.

## What it is

`SimpleEventBus` implements both [`EventProducer`](./EventBus.md) and
[`EventConsumer`](./EventBus.md) in a single class. It maintains a `Map` from stream name strings
to arrays of [`EventHandler`](../../core/docs/EventHandler.md) instances, supporting multiple
subscribers per stream.

The delivery flow:

1. `publish(stream, event)` delegates to `consume`.
2. `consume(stream, event)` retrieves all handlers for the stream and calls `handler.handle(event)`
   on each concurrently via `Promise.all`.
3. If no handlers are registered for the stream, `consume` returns silently — publishing to an
   unsubscribed stream is not an error.

Any handler rejection propagates out of `publish`/`consume` as a thrown error. Use
[`ResultedEventBus`](./ResultedEventBus.md) if you need all handler failures collected and
returned rather than thrown.

## Usage

```typescript
import { SimpleEventBus } from '@infrastructure/EventBus/implementations/SimpleEventBus.ts'

const bus = new SimpleEventBus<UserEvent>()

bus.subscribe('users', userProjectionHandler)
bus.subscribe('users', auditLogHandler)

await bus.publish('users', userCreatedEvent)
```

## Related

- **Interface**: [`EventBus`](./EventBus.md)
- **Pair**: [`ResultedEventBus`](./ResultedEventBus.md)
- **Tests**: [`SimpleEventBus.spec.ts`](../EventBus/implementations/SimpleEventBus.spec.ts)
- **Depends on**: [`EventHandler`](../../core/docs/EventHandler.md)
