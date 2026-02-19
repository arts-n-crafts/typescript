# ISODateTime

> A string typed as an ISO 8601 datetime, e.g. `"2025-12-20T13:59:59.123Z"`.

## What it is

`ISODateTime` is a semantic type alias for `string` that communicates intent:
this value must be a valid ISO 8601 datetime string. TypeScript does not
validate the string's format at runtime, but using `ISODateTime` instead of
`string` makes the expectation explicit in function signatures and interfaces —
a form of **self-documenting code** aligned with **SOLID**'s Interface
Segregation Principle (narrow, purposeful types over broad ones).

In this library `ISODateTime` is used for the `occurredAt` timestamp on
`IntegrationEvent` and `ExternalEvent` — the human-readable point in time
when a message was produced. Prefer `ISODateTime` for wire formats and public
APIs where readability matters; prefer
[`UnixTimestampInSeconds`](./UnixTimestamp.md) for internal arithmetic or
systems that demand numeric timestamps.

## Interface

```typescript
export type ISODateTime = string
```

## Usage

```typescript
import type { ISODateTime } from '@core/types/ISODateTime.ts'

interface AuditEntry {
  occurredAt: ISODateTime
  action: string
}

const entry: AuditEntry = {
  occurredAt: new Date().toISOString(), // "2025-12-20T13:59:59.123Z"
  action: 'user.login',
}
```

## Related

- **Used by**: [`IntegrationEvent`](../../../infrastructure/docs/IntegrationEvent.md),
  [`ExternalEvent`](../../../infrastructure/docs/ExternalEvent.md)
- **See also**: [`UnixTimestampInSeconds`](./UnixTimestamp.md)
