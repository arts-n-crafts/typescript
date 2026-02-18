# copilot-instructions.md

This file provides guidance to Github CoPilot when working with code in this repository.

## Commands

All commands use Bun as the runtime. Run from the repository root:

```bash
bun install                      # Install dependencies
bun run build                    # Build all packages (runs in each workspace)
bun run lint                     # Lint all packages
bun run lint:fix                 # Auto-fix lint issues
bun run typecheck                # Type-check all packages
bun run coverage                 # Run tests with coverage for all packages
bun run check-exports            # Validate package exports with attw
```

Run commands scoped to a single package (e.g., v3):

```bash
cd packages/v3
bun run test                     # Run tests once
bun run test:watch               # Run tests in watch mode with coverage
bun run coverage                 # Run tests with full coverage report
bun run build                    # Build this package only
```

Run a single test file:

```bash
cd packages/v4
bun run test src/path/to/file.test.ts
```

Coverage thresholds are enforced at 100% (lines, statements, functions, branches).

## Architecture

This is a TypeScript library (`@arts-n-crafts/ts`) providing building blocks for **CQRS**, **DDD**, and **Event Sourcing** architectures. It ships two versioned packages under `packages/v3/` and `packages/v4/`, both with the same layered structure.

### Layer Structure

Each package under `packages/vN/src/` has three layers:

- **`core/`** — CQRS primitives: `Command`, `Query`, `CommandHandler`, `QueryHandler`, `EventHandler`, and factory utilities (`createCommand`, `createQuery`)
- **`domain/`** — DDD building blocks: `AggregateRoot`, `DomainEvent`, `Repository`, `Decider` (functional event sourcing), and `Specification` (composable query predicates with `.and()/.or()/.not()`)
- **`infrastructure/`** — Concrete implementations: `CommandBus`, `QueryBus`, `EventBus`, `EventStore`, `Database`, `Outbox`/`OutboxWorker`, `Repository`, and `ScenarioTest`

### Two Implementation Styles

Each infrastructure component has two implementations:
- **`Simple*`** — Returns plain `Promise<void>` or `Promise<T>`
- **`Resulted*`** — Returns `Result<T, E>` from `oxide.ts` for typed error handling without exceptions

### Key Patterns

**Decider** (functional event sourcing): Pure functions `decide(command, state) → events[]` and `evolve(state, event) → state` instead of OOP aggregates.

**Specification**: Composable predicates that serialize to `QueryNode` trees for database translation. Implementations go in `domain/Specification/implementations/`.

**Outbox Pattern**: `InMemoryOutbox` + `GenericOutboxWorker` for reliable at-least-once event delivery.

**IntegrationEvent vs DomainEvent**: `DomainEvent` has `source: 'internal'`, `IntegrationEvent` has `source: 'external'`. Use `ExternalEvent` for events received from outside the system.

**ScenarioTest**: BDD-style test helper for event-sourced aggregates:
```typescript
await scenario.given(...pastEvents).when(command).then(expectedEvents)
```

### Exports

The root `package.json` exports:
- `.` and `./v3` → `packages/v3/dist/`
- `./v4` → `packages/v4/dist/`

Each package is bundled with `tsup` producing both ESM (`.js`) and CJS (`.cjs`) with source maps and type declarations.

### Tooling

- **ESLint**: `@antfu/eslint-config` with flat config (`eslint.config.mjs`). Method signatures must use method style (`method()` not `method: () =>`).
- **Commits**: Conventional commits enforced by `commitlint` + Husky. Use `bun run commit` for interactive commit via `commitizen`.
- **Release**: `release-it` with `changelogen` for changelog generation.


## Rule: always use qmd before reading files

Before reading files or exploring directories, always use qmd to search for information in local projects.

Available tools:

- `qmd search “query”` — fast keyword search (BM25)

- `qmd query “query”` — hybrid search with reranking (best quality)

- `qmd vsearch “query”` — semantic vector search

- `qmd get <file>` — retrieve a specific document

Use qmd search for quick lookups and qmd query for complex questions.

Use Read/Glob only if qmd doesn’t return enough results.

## Rule: after completing a plan run checks

Run the checks:

- bun run lint:fix                 # Auto-fix lint issues
- bun run typecheck                # Type-check all packages
- bun run coverage                 # Run tests with coverage for all packages
- bun run check-exports            # Validate package exports with attw

## Rule: use Context7 for update to date documentation

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Rule: use Copilots instructions for code generation

When generating code, always follow the instructions in .github/copilot-instructions.md to ensure consistency with project conventions and tooling.

## Rule: store prompts in .github/prompts

Store all prompts in .github/prompts/ with descriptive filenames. This keeps the repository organized and allows for easy reference and reuse of prompts.

## Rule: use ADRs for architectural decisions

Document all significant architectural decisions in the docs/adr/ directory using the ADR template. This provides context and rationale for future maintainers and helps track the evolution of the codebase.