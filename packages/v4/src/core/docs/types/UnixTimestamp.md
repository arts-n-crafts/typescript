# UnixTimestampInSeconds

> A number typed as seconds elapsed since the Unix epoch (1970-01-01T00:00:00Z).

## What it is

`UnixTimestampInSeconds` is a semantic type alias for `number` that signals
integer-seconds precision. Like [`ISODateTime`](./ISODateTime.md), it is a
documentation-level constraint — TypeScript does not enforce the unit at
runtime — but it prevents the common mistake of mixing millisecond and
second timestamps in the same interface.

Use `UnixTimestampInSeconds` when interoperating with external systems or APIs
that expect second-precision Unix timestamps (e.g. JWT `exp`/`iat` claims,
certain message broker headers, or POSIX-style timestamps). For internal
calculations or when sub-second resolution matters, use milliseconds directly
(e.g. `Date.now()` or [`getTimestamp`](../getTimestamp.md)).

## Interface

```typescript
export type UnixTimestampInSeconds = number
```

## Usage

```typescript
import type { UnixTimestampInSeconds } from '@core/types/UnixTimestamp.ts'

const now: UnixTimestampInSeconds = Math.floor(Date.now() / 1000)

// JWT-style expiry: 1 hour from now
const exp: UnixTimestampInSeconds = now + 3600
```

## Related

- **See also**: [`ISODateTime`](./ISODateTime.md),
  [`getTimestamp`](../getTimestamp.md)
