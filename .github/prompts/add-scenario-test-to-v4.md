# Prompt: Add ScenarioTest to v4

**Date:** 2026-02-18

## Context

The v4 package has differences from v3:
- `Rejection` interface for modeling failed command decisions
- `IntegrationEvent` with `kind: 'integration'` discriminator and `ISODateTime` timestamp
- `DomainEvent` with `kind: 'domain'` discriminator
- No `BaseEvent` type
- `Directive` interface added

The `ScenarioTest` BDD-style test helper exists in v3 but not in v4.

## Requirements

1. Port `ScenarioTest` from v3 to v4
2. Support `Rejection` as a valid `then()` outcome when testing commands
3. No module pattern — wire handlers directly in test setup
4. Maintain existing `ScenarioTest` interface (no new methods like `thenRejects()`)
5. Every new file must have a companion spec using in-memory variants only
6. No interface changes except where explicitly justified

## Key Architectural Decisions

### 1. Rejection Flow: Command Handler → Outbox

**Decision:** Rejections bypass the event store and are written directly to the outbox by the command handler.

**Rationale:**
- Domain events represent state changes → belong in the event store
- Rejections represent refused commands → never part of the aggregate's event stream
- In production: event store → DynamoDB Stream → outbox (for domain events)
- For rejections: command handler → outbox directly (no event store involved)

**Implementation:**
- Command handlers inject both `Repository` and `Outbox`
- After `decide()`, branch on `isRejection(result)`:
  - If rejection → `outbox.enqueue(rejection)`
  - If events → `repository.store(events)`

### 2. Outbox Owns Conversion to IntegrationEvent

**Decision:** Widen `Outbox.enqueue()` to accept `DomainEvent | Rejection`. The outbox converts both to `IntegrationEvent` internally before storing.

**Rationale:**
- Single responsibility: the outbox is the boundary between internal and external messages
- Callers (command handlers, event store) don't need conversion knowledge
- `OutboxEntry.event` is always `IntegrationEvent` — consistent storage format
- `SimpleEventStore` simulates DynamoDB Stream behavior by enqueueing domain events to the outbox

**Implementation:**
- `Outbox.enqueue(event: DomainEvent | Rejection): Promise<void>`
- `OutboxEntry.event: IntegrationEvent`
- `InMemoryOutbox.enqueue()` calls `convertDomainEventToIntegrationEvent` or `convertRejectionToIntegrationEvent` based on `isRejection()`

### 3. Decider Returns `TEvent[] | Rejection`

**Decision:** Widen `Decider.decide()` return type to `TEvent[] | Rejection` (breaking change).

**Rationale:**
- A rejection is a domain decision, not an infrastructure error
- The decider is the right place to model "this command was refused"
- Returning `[]` (empty array) loses semantic information about *why* nothing happened
- Enables rich rejection metadata (reasonCode, classification, retryable, etc.)

**Implementation:**
- `Decider.decide(command, state): TEvent[] | Rejection`
- `User.decide` returns `Rejection` with `reasonCode: 'ALREADY_EXISTS'` for duplicate `CreateUser`
- All existing decider implementations must be updated (accepted breaking change)

### 4. ScenarioTest Asserts Rejections via Outbox

**Decision:** `ScenarioTest.then()` accepts `Rejection` as an overload. When `when(command)` is followed by `then(rejection)`, assert the outbox contains a matching `IntegrationEvent` with `outcome: 'rejected'`.

**Rationale:**
- Rejections are published as `IntegrationEvent`s (for external consumers, metrics, audit)
- The outbox is the single source of truth for what will be published
- No new `thenRejects()` method needed — overload keeps the fluent API clean

**Implementation:**
- `ThenInput = DomainEvent | Rejection | Array<Record<string, unknown>>`
- `handleCommand()` branches on `isRejection(outcome)`:
  - Check `outbox.getPending()` for `IntegrationEvent` with `metadata.outcome === 'rejected'`, matching `commandType` and `reasonCode`

### 5. Projection Handlers Guard on `isDomainEvent`

**Decision:** Event handlers that build projections (e.g., `UserProjectionHandler`) must guard on `isDomainEvent(event)` before processing.

**Rationale:**
- The outbox worker publishes `IntegrationEvent`s through the event bus
- Projection handlers should only react to internal domain events, not external integration events
- Without the guard, `UserProjectionHandler` would try to process the same event twice (once as `DomainEvent`, once as `IntegrationEvent` from the outbox)

**Implementation:**
```typescript
isUserCreatedEvent(anEvent): anEvent is UserCreatedEvent {
  return isDomainEvent(anEvent) && anEvent.type === 'UserCreated'
}
```

### 6. ScenarioTest `given()` Publishes Events to Event Bus

**Decision:** The `given()` step stores domain events in the repository *and* publishes them through the event bus.

**Rationale:**
- Projections (query models) are built by event handlers subscribed to the event bus
- Without publishing, `UserProjectionHandler` never sees the `given` events, so queries return empty results
- Mirrors production behavior: events are stored *and* published

**Implementation:**
```typescript
await Promise.all([
  this.repository.store(domainEvents),
  ...domainEvents.map(async event => this.eventBus.consume(this.streamName, event)),
  ...integrationEvents.map(async event => this.eventBus.consume(this.streamName, event)),
])
```

## Files Created

**Domain utils:**
- `domain/utils/convertDomainEventToIntegrationEvent.ts` + spec
- `domain/utils/convertRejectionToIntegrationEvent.ts` + spec
- `domain/utils/isRejection.ts` + spec

**Core examples:**
- `core/examples/UserProjection.ts` (projection handler for query tests)

**Infrastructure:**
- `infrastructure/ScenarioTest/ScenarioTest.ts`
- `infrastructure/ScenarioTest/ScenarioTest.spec.ts`

**Handler specs:**
- `core/examples/CreateUserHandler.spec.ts`
- `core/examples/UpdateUserNameHandler.spec.ts`

## Files Modified

**Domain:**
- `domain/Decider.ts` — `decide` returns `TEvent[] | Rejection`
- `domain/examples/User.ts` — returns `Rejection` for duplicate `CreateUser`
- `domain/index.ts` — export new utils

**Infrastructure:**
- `infrastructure/Outbox/Outbox.ts` — widen `enqueue()` to `DomainEvent | Rejection`
- `infrastructure/Outbox/OutboxEntry.ts` — `event: IntegrationEvent`
- `infrastructure/Outbox/implementations/InMemoryOutbox.ts` — convert before storing
- `infrastructure/Outbox/utils/createOutboxEntry.ts` — accept `IntegrationEvent`, remove `Object.freeze`
- `infrastructure/index.ts` — export `ScenarioTest`

**Command handlers:**
- `core/examples/CreateUserHandler.ts` — inject `Outbox`, branch on `isRejection`
- `core/examples/UpdateUserNameHandler.ts` — inject `Outbox`, branch on `isRejection`
- `core/examples/ActivateUserHandler.ts` — inject `Outbox`, branch on `isRejection`

**Existing specs updated:**
- All specs using command handlers now inject `InMemoryOutbox`
- `User.spec.ts` — assert `Rejection` for duplicate create
- `Outbox.spec.ts` — assert on `IntegrationEvent` shape
- `OutboxWorker.spec.ts` — assert handler receives `IntegrationEvent`
- `OutboxEntry.spec.ts` — use `createIntegrationEvent`
- Repository specs — narrow `decide()` result to `UserEvent[]` before accessing `[0].payload`

## Test Results

- **254 tests passing** across 50 test files
- **Lint:** ✅ Clean
- **Typecheck:** ✅ Clean
- **Coverage:** ⚠️ 99.34% (ScenarioTest.ts line 70 uncovered — see ADR-006)

## Related ADRs

- ADR-001: Rejection is Not a Domain Event
- ADR-002: Outbox Owns IntegrationEvent Conversion
- ADR-003: Command Handler Orchestrates Rejection Publishing
- ADR-004: Decider Returns Rejection for Business Rule Violations
- ADR-005: ScenarioTest Asserts Rejections via Outbox
- ADR-006: Projection Handlers Guard on isDomainEvent

