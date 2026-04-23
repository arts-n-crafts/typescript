---
status: accepted
date: 2026-02-22
decision-makers: []
---

# ADR-0001: Modular Functional Core Imperative Shell Folder Structure

## Context and Problem Statement

We need a folder structure for a Rust API that:
- Applies Functional Core Imperative Shell (FCIS) to keep domain logic pure and testable
- Organises code by vertical slices (use cases) rather than horizontal layers alone
- Supports multiple business contexts within a single bounded context
- Makes the flow of commands, queries, and events explicit and navigable
- Keeps concerns cleanly separated without over-engineering

## Decision Drivers

- Pure domain logic must never depend on infrastructure or I/O
- Each use case should be self-contained and easy to locate
- Inbound adapters belong to the use case they serve
- Outbound adapters are shared across use cases within a business context
- Events and shared intents are module-level domain concepts
- Commands, decisions, queries, and projections are use case specific
- The system is fully event-centric: domain events, intents, and technical events are all modelled explicitly
- Technical events capture I/O facts at every adapter boundary for observability — no logging

## Considered Options

1. Flat horizontal layers (core / application / adapters / shell)
2. Vertical slices only, no shared kernel
3. Vertical slices with shared kernel and modular boundaries
4. Hexagonal architecture with ports and adapters named by driving/driven

## Decision Outcome

Chosen option 3: **Vertical slices with shared kernel and modular boundaries**, because it balances purity of the functional core, navigability of use cases, and explicit separation of shared infrastructure without collapsing into a god object or over-splitting into too many crates.

### Consequences

* Good, because pure core is trivially testable without mocks
* Good, because each use case is self-contained and easy to locate, modify, or delete
* Good, because adding a new use case means adding a new folder — nothing else changes
* Good, because adding a new transport means adding a new inbound adapter — the handler is untouched
* Good, because outbound implementations can be swapped in the shell without touching any other layer
* Good, because technical events provide full observability without log statements
* Good, because the intent model keeps domain communication explicit and infrastructure-agnostic
* Bad, because more folders than a flat layered structure — navigation requires understanding the hierarchy
* Bad, because the `TechnicalEventStore` cross-cuts inbound and outbound — requires discipline to keep it the only exception
* Bad, because config at multiple levels (bounded context, module) requires care to avoid duplication
* Bad, because the distinction between module-level intents and use case-level rejection intents requires consistent application by developers
* Bad, because `shared/` can grow into a dumping ground if the rule "only what two or more modules need" is not enforced
* Bad, because module `mod.rs` public API must be kept minimal — leaking internal types couples the shell to module internals

### Confirmation

Compliance is confirmed by code review: `core/` contains no `async fn` or I/O imports; inbound adapters live inside their use case folder; outbound adapters live under `adapters/outbound/` at module level; the shell is the only place that constructs concrete infrastructure implementations.

## Folder Structure

```
src/
  shared/
    core/
      mod.rs
      primitives.rs
    infrastructure/
      mod.rs
      event_store/
        mod.rs                        // pub trait EventStore
        in_memory.rs
        postgres.rs
      intent_outbox/
        mod.rs                        // pub trait IntentOutbox
        in_memory.rs
        kafka.rs
      technical_event_store/
        mod.rs                        // pub trait TechnicalEventStore
        in_memory.rs
    config/
      mod.rs
      kafka.rs
      database.rs

  modules/
    time_entries/
      mod.rs                          // pub fn routes() -> Router
                                      // pub fn kafka_handlers() -> KafkaRouter
      core/
        mod.rs
        events.rs                     // TimeEntryCreated, TimeEntryApproved, etc.
        intents.rs                    // shared intents across use cases
        evolve.rs                     // pure state evolution
        projections.rs                // shared projection mappings
      use_cases/
        create_time_entry/
          mod.rs
          commands.rs                 // CreateTimeEntry
          decision.rs                 // Decision type
          handler.rs
          inbound/
            http.rs
            kafka.rs
        approve_time_entry/
          mod.rs
          commands.rs                 // ApproveTimeEntry
          decision.rs
          handler.rs
          inbound/
            http.rs
            kafka.rs
        list_time_entries/
          mod.rs
          queries.rs                  // ListTimeEntries query
          projection.rs               // ListTimeEntriesProjection
          handler.rs
          inbound/
            http.rs
      adapters/
        outbound/
          event_store.rs
          intent_outbox.rs
      config/
        mod.rs

    approvals/
      mod.rs
      core/
        mod.rs
        events.rs
        intents.rs
        evolve.rs
        projections.rs
      use_cases/
        request_approval/
          mod.rs
          commands.rs
          decision.rs
          handler.rs
          inbound/
            http.rs
            kafka.rs
        review_approval/
          mod.rs
          commands.rs
          decision.rs
          handler.rs
          inbound/
            http.rs
        list_approvals/
          mod.rs
          queries.rs
          projection.rs
          handler.rs
          inbound/
            http.rs
      adapters/
        outbound/
          event_store.rs
          intent_outbox.rs
      config/
        mod.rs

  shell/
    mod.rs
    main.rs
```

## Rationale

### Shared kernel

`shared/` contains what every module depends on but does not own. Infrastructure ports (traits) are public; implementations are private. The shell is the only place that knows which implementation backs each port and wires them together. `shared/core/` holds bounded context-wide primitives — types shared across all business contexts that do not belong to any single module.

### Modules as business contexts

Each folder under `modules/` is a business context with its own domain core, use cases, outbound adapters, and config. Modules never depend on each other. If a type is needed by two modules it belongs in `shared/core/` instead.

Each module exposes only what the shell needs via its `mod.rs`: an HTTP router and a Kafka handler registry. All internal structure is private.

### Core within a module

`core/` holds the pure functional core for that business context:

- **`events.rs`** — domain facts shared across all use cases within the module. Events are module-level because multiple use cases need to read and evolve state from the same event stream.
- **`intents.rs`** — intents that express domain consequences relevant to more than one use case. Use case-specific inform intents (e.g. rejection notifications) are added by the application layer, not the decider.
- **`evolve.rs`** — pure state evolution function. Takes current state and an event, returns new state. No side effects.
- **`projections.rs`** — shared projection mappings used across query use cases.

Nothing in `core/` depends on infrastructure, I/O, or any adapter.

### Use cases as vertical slices

Each use case owns everything specific to one operation:

- **`commands.rs`** — the command type for this use case. One command per use case.
- **`decision.rs`** — the Decision type returned by the decider: `Accepted { events, intents }` or `Rejected { reason }`. Use case specific because it is the output of one decider for one command.
- **`handler.rs`** — the command or query handler. Orchestrates: load state → call decider → persist events → write intents to outbox → write technical events. Impure but thin.
- **`queries.rs`** — the query type for query use cases.
- **`projection.rs`** — the read model built from events to serve this specific query. Lives in the use case because it exists solely to serve one query handler.
- **`inbound/`** — inbound adapters for this use case. Each adapter translates one transport (HTTP, Kafka) into the use case's command or query and calls the handler. Inbound adapters belong to the use case because they have no meaning outside it.

### Inbound adapters named by technology

Inbound adapters are named by the technology they originate from (`http.rs`, `kafka.rs`) because their job is translating a specific transport into a domain command. The technology is the reason they exist. A Kafka inbound adapter for a module uses a router pattern — a thin dispatcher that extracts a command type header and delegates to the appropriate use case adapter, keeping each adapter focused and preventing a god object.

### Outbound adapters named by function

Outbound adapters live at the module level (`adapters/outbound/`) and are shared across all use cases within the module. They are named by function (`event_store.rs`, `intent_outbox.rs`) because the application layer defines ports by what they do, and multiple implementations can back the same port. The shell decides which implementation to inject.

### Decision and rejection flow

The decider returns a pure `Decision::Accepted` or `Decision::Rejected { reason }`. The decider never expresses how rejections are communicated — that is a cross-cutting application policy owned by the command handler. The handler adds `Intent::InformCallerOfRejection` to the outbox for any rejection, uniformly across all commands, without each decider needing to know callers exist.

### Three event stores, not one

The system maintains three distinct durable stores:

- **Domain event store** — append-only log of domain facts. The source of truth for state reconstruction and projection building. Tailed by the event relay to publish integration events externally.
- **Intent outbox** — durable buffer for intents requiring guaranteed at-least-once delivery to external systems. Polled by the intent relay which translates domain intents into broker messages or HTTP calls.
- **Technical event store** — structured I/O facts captured at every adapter boundary. Written directly by adapters, not transactionally with domain decisions. Consumed by monitoring and analysis systems. Replaces logging entirely.

### Intent as a domain concept

Intents express what should happen elsewhere as a consequence of a decision. They are domain vocabulary (`NotifyUserOfApproval`, `SyncToPayrollSystem`) not infrastructure vocabulary (`OutboxMessage { topic, payload }`). The translation from intent to broker message or HTTP payload happens in the intent relay (outbound adapter), not in the core or application layer.

### Technical event store as cross-cutting concern

The `TechnicalEventStore` port is injected into both inbound and outbound adapters because I/O facts must be captured at every boundary regardless of direction. This is the one intentional exception to the rule that inbound and outbound adapters do not share concerns. It is resolved cleanly through the port abstraction — every adapter depends on the port, the shell injects the same concrete implementation everywhere.

### Shell as composition root

`shell/main.rs` is the only place with full visibility of the system. It reads config, instantiates infrastructure implementations, injects them into use case handlers, mounts module routes, spawns background workers (`tokio::spawn`), and starts the process. No other layer knows about concrete implementations.
