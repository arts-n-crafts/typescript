# ADR-0012: Specification Pattern for Business Rules

## Status

Accepted

## Context and Problem Statement

The decider contains the business rules that determine whether a command is accepted or rejected. Inline conditionals inside the decider make individual rules hard to name, reuse, and test in isolation. We want to isolate each business rule as a named, single-purpose unit that can be composed by the decider — applying the specification pattern to the functional core.

## Decision Drivers

- Each business rule must have a name that expresses its domain meaning
- Rules must be testable in isolation, independent of the decider
- Rules must be reusable across use cases when they genuinely apply
- The decider must remain readable — composition, not inline conditionals
- The functional core must stay pure — specifications have no I/O
- A rule violation must propagate cleanly to the command handler and ultimately to the caller without multiple mapping steps

## Considered Options

1. Inline conditionals in the decider — no specification pattern
2. Specifications as plain functions returning `Option<DomainRejection>`
3. Specifications as unit structs with a `check` method
4. Specifications as unit structs implementing a `Specification` trait with `is_satisfied_by`

## Decision Outcome

Chosen option 4: **Specifications as unit structs implementing a `Specification` trait with `is_satisfied_by`**, because it uses canonical specification pattern vocabulary, produces named discoverable types, and provides a consistent interface that the decider composes generically.

---

## The Specification Trait

A single trait defines the specification contract. Every business rule implements it. The trait is generic over state, command, and rejection types so each specification declares what rejection it produces:

```rust
// core/specifications.rs

pub trait Specification<S, C, R> {
    fn is_satisfied_by(&self, state: &S, command: &C) -> Option<R>;
}
```

The method returns `Option<R>` — `None` when the specification is satisfied, `Some(rejection)` when it is violated. The rejection type is the use case rejection enum produced by the specification.

---

## Rejection Types

Because specifications can be either shared across use cases or specific to one use case, rejection variants follow the same distinction. Rather than forcing all variants into a single module-level enum — which would pull use case concerns into shared vocabulary — each use case owns its own rejection enum. Shared rejection variants live in module core and are composed into the use case enum.

**Shared rejections** — produced by shared specifications used across multiple use cases — live in `core/rejections.rs`:

```rust
// core/rejections.rs

pub enum SharedRejection {
    TimeEntryNotFound,
    UserNotAuthorised,
}
```

**Use case rejections** — specific to one use case — live inside the use case alongside the decider and specifications. The use case enum carries both its own variants and a variant that wraps the shared rejection:

```rust
// use_cases/create_time_entry/rejections.rs

pub enum CreateTimeEntryRejection {
    TimeEntryAlreadyExists,
    InvalidTimeRange,
    Shared(SharedRejection),
}
```

```rust
// use_cases/approve_time_entry/rejections.rs

pub enum ApproveTimeEntryRejection {
    EntryAlreadyApproved,
    EntryIsLocked,
    Shared(SharedRejection),
}
```

This keeps each use case's rejection surface focused on what that use case actually produces, while sharing common rejections without duplication.

---

## Specification Return Type

The `Specification` trait is generic over the rejection type so each specification declares exactly which rejection it produces:

```rust
// core/specifications.rs

pub trait Specification<S, C, R> {
    fn is_satisfied_by(&self, state: &S, command: &C) -> Option<R>;
}
```

Shared specifications are generic over the use case rejection type but constrain it to be constructible from a `SharedRejection`:

```rust
// core/specifications.rs — shared

pub struct TimeEntryMustExist;

impl<C, R> Specification<TimeEntryState, C, R> for TimeEntryMustExist
where
    R: From<SharedRejection>,
{
    fn is_satisfied_by(&self, state: &TimeEntryState, _command: &C) -> Option<R> {
        if !state.exists() {
            Some(SharedRejection::TimeEntryNotFound.into())
        } else {
            None
        }
    }
}
```

Each use case rejection enum implements `From<SharedRejection>` for its `Shared` variant. This allows shared specifications to be reused across use cases while producing the correct use case rejection type.

Use case specific specifications are simpler — they produce their own use case rejection directly:

```rust
// use_cases/create_time_entry/specifications.rs

pub struct TimeRangeIsValid;

impl Specification<TimeEntryState, CreateTimeEntry, CreateTimeEntryRejection> for TimeRangeIsValid {
    fn is_satisfied_by(
        &self,
        _state: &TimeEntryState,
        command: &CreateTimeEntry,
    ) -> Option<CreateTimeEntryRejection> {
        if command.end <= command.start {
            Some(CreateTimeEntryRejection::InvalidTimeRange)
        } else {
            None
        }
    }
}
```

---

## Decision Type

Each use case's Decision carries its own rejection type:

```rust
// use_cases/create_time_entry/decision.rs

pub enum Decision {
    Accepted {
        events: Vec<TimeEntryEvent>,
        intents: Vec<Intent>,
    },
    Rejected {
        reason: CreateTimeEntryRejection,
    },
}
```

The rejection flows through the stack without transformation until the inbound adapter. The command handler's error type carries the use case rejection, and the inbound adapter pattern matches on it to translate to a transport response.

---

## Specification Location

Specifications live in two places depending on reuse:

**Shared specifications** — used by multiple use cases within a module — live in `core/specifications.rs` alongside events and evolve. They are part of the module's shared domain vocabulary.

**Use case specific specifications** — used by exactly one use case — live inside the use case folder, co-located with the decider and command. They are only exposed if another use case later needs them, at which point they move to `core/specifications.rs`.

```
modules/
  time_entries/
    core/
      events.rs
      intents.rs
      evolve.rs
      rejections.rs              // SharedRejection enum
      specifications.rs          // shared specifications
    use_cases/
      create_time_entry/
        mod.rs
        commands.rs
        decision.rs
        decider.rs
        rejections.rs            // CreateTimeEntryRejection enum
        specifications.rs        // use case specific specifications
        handler.rs
        inbound/
```

---

## Specifications as Unit Structs

Specifications are always unit structs — no fields, no configuration. Any value the rule needs must come from the state or the command passed to `is_satisfied_by`. Configuration as struct fields is explicitly rejected to keep specifications simple and stateless:

```rust
// use_cases/create_time_entry/specifications.rs

pub struct TimeEntryDoesNotAlreadyExist;

impl Specification<TimeEntryState, CreateTimeEntry, CreateTimeEntryRejection>
    for TimeEntryDoesNotAlreadyExist
{
    fn is_satisfied_by(
        &self,
        state: &TimeEntryState,
        _command: &CreateTimeEntry,
    ) -> Option<CreateTimeEntryRejection> {
        if state.exists() {
            Some(CreateTimeEntryRejection::TimeEntryAlreadyExists)
        } else {
            None
        }
    }
}

pub struct TimeRangeIsValid;

impl Specification<TimeEntryState, CreateTimeEntry, CreateTimeEntryRejection>
    for TimeRangeIsValid
{
    fn is_satisfied_by(
        &self,
        _state: &TimeEntryState,
        command: &CreateTimeEntry,
    ) -> Option<CreateTimeEntryRejection> {
        if command.end <= command.start {
            Some(CreateTimeEntryRejection::InvalidTimeRange)
        } else {
            None
        }
    }
}
```

A shared specification in `core/specifications.rs` is generic over the rejection type, constrained to be constructible from `SharedRejection`:

```rust
// core/specifications.rs

pub struct UserIsAuthorised;

impl<C, R> Specification<TimeEntryState, C, R> for UserIsAuthorised
where
    C: HasUserId,
    R: From<SharedRejection>,
{
    fn is_satisfied_by(&self, state: &TimeEntryState, command: &C) -> Option<R> {
        if !state.user_is_authorised(command.user_id()) {
            Some(SharedRejection::UserNotAuthorised.into())
        } else {
            None
        }
    }
}
```

If a rule needs a threshold or policy value, that value belongs in the command (for per-request values) or in the state (for policy that varies per aggregate). Specifications themselves remain stateless.

---

## Decider Composition

The decider composes specifications with early exit — the first violation is returned immediately, later specifications are not evaluated:

```rust
// use_cases/create_time_entry/decider.rs

pub fn decide(state: &TimeEntryState, command: CreateTimeEntry) -> Decision {
    if let Some(rejection) = TimeEntryDoesNotAlreadyExist.is_satisfied_by(&state, &command) {
        return Decision::Rejected { reason: rejection };
    }

    if let Some(rejection) = TimeRangeIsValid.is_satisfied_by(&state, &command) {
        return Decision::Rejected { reason: rejection };
    }

    Decision::Accepted {
        events: vec![TimeEntryEvent::Created(TimeEntryCreated {
            id: command.id,
            user_id: command.user_id,
            start: command.start,
            end: command.end,
        })],
        intents: vec![],
    }
}
```

The decider reads as a sequence of named business rules followed by the construction of events and intents when all rules are satisfied. Each rule is testable independently by calling `is_satisfied_by` with crafted state and command.

---

## No Combinators — Defer Composition

The `Specification` trait does not provide `and`, `or`, or `not` combinators. Sequential composition in the decider with early exit is sufficient for the current need. Generic combinators are deferred until a concrete need arises — at which point a dedicated ADR can introduce them without changing existing specifications.

This keeps the trait minimal. If complex logical composition is ever needed, a composite specification can be implemented as its own named type — expressing the combined rule as a single domain concept rather than as an anonymous algebraic combination.

---

## Testing Specifications

Each specification is testable in isolation because it is a pure function over state and command. No mocks, no fixtures, no decider involved:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn time_range_is_valid_rejects_when_end_is_before_start() {
        let state = TimeEntryState::default();
        let command = CreateTimeEntry {
            start: parse_time("10:00"),
            end: parse_time("09:00"),
            ..default_command()
        };

        let result = TimeRangeIsValid.is_satisfied_by(&state, &command);

        assert_eq!(result, Some(CreateTimeEntryRejection::InvalidTimeRange));
    }

    #[test]
    fn time_range_is_valid_accepts_when_end_is_after_start() {
        let state = TimeEntryState::default();
        let command = CreateTimeEntry {
            start: parse_time("09:00"),
            end: parse_time("10:00"),
            ..default_command()
        };

        let result = TimeRangeIsValid.is_satisfied_by(&state, &command);

        assert_eq!(result, None);
    }
}
```

The decider has its own tests that verify the composition and the acceptance path. Specification tests and decider tests together cover the business rules exhaustively.

---

## Flow of a Rejection

A domain rejection flows through the stack without transformation until it reaches the inbound adapter. For use case specific rejections it flows directly. For shared rejections produced by shared specifications, the `From<SharedRejection>` implementation on the use case rejection enum wraps it into the use case type at the specification boundary:

1. Specification returns `Some(CreateTimeEntryRejection::TimeEntryAlreadyExists)` (use case specific) or `Some(CreateTimeEntryRejection::Shared(SharedRejection::UserNotAuthorised))` (wrapped shared)
2. Decider returns `Decision::Rejected { reason: CreateTimeEntryRejection::... }`
3. Command handler receives the decision and writes `Intent::InformCallerOfRejection { reason }` to the outbox (per ADR-0005), then returns `CommandError::Rejected(CreateTimeEntryRejection::...)` to the inbound adapter
4. Inbound adapter pattern matches on the use case rejection type and translates to the appropriate transport response (HTTP 409 Conflict with a domain error code, or a typed error variant for internal callers)

The use case rejection type is stable from specification to inbound adapter. The inbound adapter is the only place that knows about transport-specific error codes or formats.

---

## Rules

1. Every business rule in the decider is expressed as a specification — inline conditionals in the decider for business rules are not permitted
2. Specifications are always unit structs — no fields, no configuration
3. Specifications return `Option<R>` where `R` is the use case rejection type — `None` when satisfied, `Some(rejection)` when violated
4. Shared specifications live in `core/specifications.rs` and are generic over any rejection type constructible from `SharedRejection` — use case specific specifications live inside the use case and produce the use case rejection type directly
5. Each use case owns its rejection enum — shared rejections are composed via a `Shared(SharedRejection)` variant with a `From<SharedRejection>` implementation
6. The decider composes specifications with early exit — the first violation is returned immediately
7. Rejections flow unchanged from specification to inbound adapter — no intermediate mapping at any intervening layer
8. Combinators on the trait (and, or, not) are not added until a concrete need arises — composite rules are expressed as named types

---

## Consequences

### Positive

- Every business rule has a name that expresses its domain meaning
- Rules are testable in isolation without involving the decider
- The decider reads as a sequence of named business concepts rather than a block of conditionals
- Adding a new rule means adding a new specification and composing it in the decider — existing specifications are unaffected
- Reuse across use cases is natural — move the specification to `core/specifications.rs`, import where needed
- Each use case rejection enum surfaces only the variants that use case actually produces — no irrelevant module-level variants leaking in
- Shared rejections are composed without duplication via a `Shared` variant and `From` implementation
- The trait minimalism (no combinators) keeps the pattern simple until real composition needs emerge

### Negative

- More files and more types for small rules — mitigated by the clarity gain and the cheap cost of unit structs
- Each use case rejection enum requires a `From<SharedRejection>` implementation — small, mechanical, but must be remembered when adding a new use case
- Shared specifications are generic over the rejection type — the generic constraints add some noise to their signatures compared to use case specific specifications
- Early exit means only the first violation is surfaced — if a caller benefits from seeing all violations at once, a future ADR can introduce an aggregating decider variant, but early exit is the correct default for command processing
- Specifications without configuration cannot express policy that varies at runtime — policy values must be passed via command or state, which is a deliberate constraint

### Risks

- Developers writing inline conditionals in the decider instead of specifications — enforce in code review; the rule is explicit (this ADR serves that purpose)
- Shared specifications becoming a dumping ground — apply the same rule as for shared kernels: a specification moves to shared only when two or more use cases genuinely use it
- Use case rejection enums drifting into duplicated variants that should be shared — surface this in code review by watching for variants with identical meaning across use cases
- Specifications with hidden coupling to specific state shapes — each specification is generic over state and command types via the trait, so type-level coupling is explicit rather than hidden