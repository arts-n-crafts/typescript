---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0003: Intent and Outbox Pattern

## Context and Problem Statement

When a command is accepted or rejected, the system may need to communicate outcomes or trigger actions in external systems. We need a consistent model for expressing and delivering that communication without coupling domain logic to infrastructure concerns like message brokers, topics, or HTTP endpoints.

## Decision Drivers

- Domain logic must not know about brokers, topics, or external system contracts
- Intent to communicate something externally must survive process crashes — at-least-once delivery
- Rejection notifications must be sent consistently across all commands without each decider needing to express it
- The translation from domain intent to infrastructure message belongs at the boundary, not in the core
- Intents that are domain-meaningful (consequences of a decision) are different from cross-cutting application concerns (rejection notifications)

## Considered Options

1. Publish directly to Kafka from the command handler
2. Use a generic outbox with serialised payloads (`OutboxMessage { topic, payload: Vec<u8> }`)
3. Model intent as a domain type, translate to infrastructure in the relay
4. Let the inbound adapter handle notification on rejection via direct response only

## Decision Outcome

Chosen option 3: **Intent as a domain type, translated to infrastructure in the relay**, because it keeps domain vocabulary in the domain, infrastructure vocabulary in the adapters, and makes the system's communication contracts explicit and readable without scattering broker concerns throughout the codebase.

### Consequences

* Good, because domain code expresses communication intent in business terms — readable and meaningful
* Good, because infrastructure details (brokers, topics, schemas) are contained entirely in the relay
* Good, because rejection notification is handled uniformly by the application layer — no individual decider needs to remember it
* Good, because the outbox guarantees delivery without the domain knowing about reliability mechanisms
* Good, because adding a new intent means adding a variant to the enum and a match arm in the relay — nothing else changes
* Bad, because the intent relay's match arm grows as intents grow — mitigated by keeping each arm thin and delegating to typed message builders
* Bad, because the outbox requires a polling mechanism or change stream — operational concern owned by the relay infrastructure
* Bad, because conflating domain intents with application-layer intents in `core/intents.rs` is a risk — keep the rule clear: only intents that are domain consequences of a decision belong in core; cross-cutting concerns like rejection notification are added by the handler
* Bad, because intent relay can become a god object as the system grows — consider splitting into domain-specific relays if the match arm becomes unmanageable

### Confirmation

Compliance is confirmed by code review: decider functions never return `Intent::InformCallerOfRejection`; all broker/topic knowledge is contained in relay files; intent types in `core/intents.rs` are only those that are consequences of domain decisions.

## Intent as a Domain Concept

An intent is an explicit expression of what should happen elsewhere as a consequence of a decision. It is domain vocabulary, not infrastructure vocabulary:

```rust
// core/intents.rs

pub enum Intent {
    NotifyUserOfApproval { user_id: UserId, entry_id: TimeEntryId },
    InformCallerOfRejection { reason: RejectionReason },
    SyncToPayrollSystem { entry_id: TimeEntryId, duration: Duration },
}
```

The domain expresses *what* should happen. The relay decides *how* — which broker, which topic, which payload schema. This translation happens entirely in the outbound adapter:

```rust
// adapters/outbound/intent_relay.rs

impl IntentRelay {
    pub async fn relay(&self, intent: Intent) {
        match intent {
            Intent::NotifyUserOfApproval { user_id, entry_id } => {
                self.kafka.publish("user-notifications", NotifyUserMessage {
                    user_id,
                    entry_id,
                    timestamp: Utc::now(),
                }).await;
            }
            Intent::InformCallerOfRejection { reason } => {
                self.kafka.publish("time-entries.results", RejectionMessage {
                    reason,
                    timestamp: Utc::now(),
                }).await;
            }
            // ...
        }
    }
}
```

## The Outbox

Intents require guaranteed at-least-once delivery — they must not be lost if the process crashes between deciding and delivering. The outbox provides this guarantee by writing intents durably in the same transaction as domain events:

```
command handler
  → persist events to event store       (atomic)
  → write intents to intent outbox      (atomic with above)
      ↓
intent relay (outbound adapter, runs async)
  → reads undelivered intents
  → translates Intent → broker message
  → delivers to external system
  → marks delivered
```

The outbox is purely a reliability mechanism. It does not change the semantic meaning of an intent — it ensures delivery. The intent type remains a domain concept regardless of how it is stored or relayed.

## Two Categories of Intent

### Domain-expressed intents

These are produced by the decider as part of `Decision::Accepted` — the domain is saying something specific should happen as a consequence of this decision:

```rust
Decision::Accepted {
    events: vec![TimeEntryApproved { .. }],
    intents: vec![Intent::NotifyUserOfApproval { user_id, entry_id }],
}
```

These live in `core/intents.rs` because they are domain vocabulary shared across use cases.

### Application-layer intents

These are added by the command handler as cross-cutting policy, not by the decider. The primary example is rejection notification:

```rust
// handler.rs
match decider::decide(&state, command) {
    Decision::Accepted { events, intents } => {
        event_store.persist(events).await;
        intent_outbox.write(intents).await;
    }
    Decision::Rejected { reason } => {
        intent_outbox.write(vec![
            Intent::InformCallerOfRejection { reason }
        ]).await;
    }
}
```

The decider returns a pure `Decision::Rejected { reason }` — it does not express how the caller is informed. The command handler adds the notification intent uniformly for all rejections. This is a deliberate separation: the decider expresses domain judgment, the application layer expresses communication policy.

## Intent Relay vs Event Relay

The intent outbox and the domain event store feed two separate relays with different responsibilities:

| | Intent Relay | Event Relay |
|---|---|---|
| Source | Intent outbox | Domain event store (tailed) |
| Direction | Directed — specific target per intent | Broadcast — all subscribers |
| Semantics | Something should happen (command to others) | Something happened (fact for observers) |
| Delivery | At-least-once via outbox poll | At-least-once via event store tail |
| Consumer | Specific external systems | Any interested service |

They must not be merged. Mixing directed intents with broadcast events in the same relay creates a god object that knows both what the domain decided and who needs to be told, conflating two distinct concerns.
