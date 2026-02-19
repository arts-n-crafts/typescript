# getTimestamp

> Returns the current time as milliseconds since the Unix epoch.

## What it is

`getTimestamp` is a thin wrapper around `Date.prototype.getTime()` that accepts
an optional `Date` and returns its millisecond timestamp. It exists as a named
utility for two reasons:

1. **Testability** — message factories (`createCommand`, `createQuery`,
   `createDomainEvent`, etc.) call `getTimestamp()` rather than `Date.now()`
   directly. In tests, a specific `Date` can be injected to produce a
   deterministic timestamp, making assertions on `timestamp` fields reliable.

2. **Single point of change** — if the library ever needs to switch timestamp
   resolution or source, one function changes instead of every factory.

This is a **sans-I/O** pattern: time is treated as an injectable dependency
rather than a global side effect, keeping message construction pure and
predictable.

The return value is milliseconds (e.g. `1355270400000` for
`2012-12-12T00:00:00Z`). When interoperating with systems that expect
second-precision timestamps, divide by 1000 and floor — see
[`UnixTimestampInSeconds`](./types/UnixTimestamp.md).

## Interface

```typescript
export const getTimestamp = (date: Date = new Date()): number => date.getTime()
```

## Usage

```typescript
import { getTimestamp } from '@core/utils/getTimestamp.ts'

// Current time (typical usage inside factories)
const timestamp = getTimestamp() // e.g. 1734000000000

// Deterministic timestamp for tests
const timestamp = getTimestamp(new Date('2012-12-12T00:00:00Z')) // 1355270400000
```

## Related

- **Tests**: [`getTimestamp.spec.ts`](../utils/getTimestamp.spec.ts)
- **Used by**: [`createCommand`](./createCommand.md),
  [`createQuery`](./createQuery.md),
  [`createDomainEvent`](../../domain/docs/createDomainEvent.md),
  [`createRejection`](../../domain/docs/createRejection.md),
  [`createStoredEvent`](../../infrastructure/docs/createStoredEvent.md),
  [`InMemoryOutbox`](../../infrastructure/docs/InMemoryOutbox.md)
- **See also**: [`UnixTimestampInSeconds`](./types/UnixTimestamp.md)
