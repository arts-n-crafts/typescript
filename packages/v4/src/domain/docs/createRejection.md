# createRejection

> Factory function that constructs a fully-formed, frozen `Rejection` object.

## What it is

`createRejection` is the standard way to instantiate a
[`Rejection`](./Rejection.md). It follows the same freeze-and-stamp pattern as
[`createDomainEvent`](./createDomainEvent.md),
[`createCommand`](../../core/docs/createCommand.md), and
[`createQuery`](../../core/docs/createQuery.md): it generates an `id` (UUID),
a `timestamp` (milliseconds since epoch via
[`getTimestamp`](../../core/docs/getTimestamp.md)), and sets `kind: 'rejection'`,
so callers only need to supply the business-meaningful fields.

One notable convention is how the `type` field is derived: the factory computes
it as `${commandType}${type}`, where `type` is a suffix — conventionally
`'Rejected'` for business rule violations or `'Failed'` for technical errors.
So a `RegisterUser` command rejected for a business reason produces the type
`'RegisterUserRejected'`, giving every rejection a descriptive, command-scoped
name without requiring callers to construct it by hand.

The conventional pattern mirrors the event factory pattern: wrap `createRejection`
in a named factory co-located with the rejection's type definition (see Usage).
This gives each rejection a typed constructor that serves as its public API and
keeps construction logic in one place.

Immutability is enforced by `Object.freeze()` — the returned object cannot be
modified after creation, consistent with the rest of the library's value objects.

## Interface

```typescript
export function createRejection<TDetails = unknown>(
  rejectionSpecifics: {
    commandId: string
    commandType: string
    reasonCode: string | 'VERSION_CONFLICT' | 'VALIDATION_FAILED'
    reason?: string
    classification: 'business' | 'validation' | 'concurrency' | 'technical'
    retryable?: boolean
    validationErrors?: Array<{ field?: string, code: string, message?: string }>
    type: 'Failed' | 'Rejected' | string
    details?: TDetails
  },
  metadata?: Partial<RejectionMetadata>,
): Rejection<TDetails>
```

## Usage

Define a typed rejection factory (from `examples/UserAlreadyExists.ts`):

```typescript
import type { CreateUserProps, RegisterUserCommand } from '@core/examples/CreateUser.ts'
import type { Rejection, RejectionMetadata } from '@domain/Rejection.ts'
import { createRejection } from '@domain/utils/createRejection.ts'

export function createUserAlreadyExistsRejection(
  command: RegisterUserCommand,
  metadata?: Partial<RejectionMetadata>,
): Rejection<CreateUserProps> {
  return createRejection({
    classification: 'business',
    commandId: command.id,
    commandType: command.type,
    reasonCode: 'ALREADY_EXISTS',
    type: 'Rejected',
    details: command.payload,
  }, metadata)
}

export type UserAlreadyExistsRejection = ReturnType<typeof createUserAlreadyExistsRejection>
```

`commandType: 'RegisterUser'` + `type: 'Rejected'` → `rejection.type === 'RegisterUserRejected'`.

Then inside a `Decider.decide()`:

```typescript
return createUserAlreadyExistsRejection(command)
```

## Related

- **Examples**: [`UserAlreadyExists.ts`](../../core/examples/UserAlreadyExists.ts)
- **Utils**: [`getTimestamp`](../../core/docs/getTimestamp.md),
  [`isRejection`](./isRejection.md)
- **Used by**: [`Rejection`](./Rejection.md), [`Decider`](./Decider.md)
