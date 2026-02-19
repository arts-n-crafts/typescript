# Prompt: Generate a concept doc for `@arts-n-crafts/ts` v4

Use this prompt when adding documentation for a new or existing concept in
`packages/v4/src/`.

---

## Rules

1. **One doc at a time.** Write a single doc, present it to the user, and
   await approval before moving to the next.

2. **Read before writing.**
   - Read the concept's `.ts` source file.
   - Read any associated `examples/`, `*.test.ts`, and `utils/` files.
   - Read relevant ADRs in `docs/adr/` if the concept has one.

3. **File location.** Place the doc in a `docs/` subfolder in the same layer:

   | Layer | Path |
   |-------|------|
   | Utils | `packages/v4/src/utils/{name}/docs/{name}.md` |
   | Core types | `packages/v4/src/core/docs/types/{TypeName}.md` |
   | Core concepts | `packages/v4/src/core/docs/{ConceptName}.md` |
   | Domain | `packages/v4/src/domain/docs/{ConceptName}.md` |
   | Infrastructure | `packages/v4/src/infrastructure/docs/{ConceptName}.md` |

4. **Follow the template exactly** (see below).

5. **Architecture scope.** The "What it is" section must mention relevant
   patterns from this list where the concept embodies them:
   - CQRS, DDD, Event Sourcing / EDA
   - Hexagonal / Ports & Adapters architecture
   - Clean Architecture (layer separation: core → domain → infrastructure)
   - Vertical Slices (features cohesive across layers)
   - Sans-I/O (pure core/domain; I/O only at infrastructure boundary)
   - SOLID principles

6. **Mermaid diagrams.** Add only when they genuinely clarify flow (e.g.
   `decide → evolve` state machine for Decider; sequence for ScenarioTest;
   composition tree for Specification). Skip for simple types.

7. **Related links.** Verify every link resolves to a real file before
   presenting the doc. Use relative paths from the doc file.

8. **Documentation order.** When generating multiple docs, work from leaf
   to root (no internal imports first, ScenarioTest last). See
   `docs/plans/2026-02-19-concept-docs-design.md` for the full wave order.

---

## Template

```markdown
# ConceptName

> One-sentence summary of what this is.

## What it is

1–2 paragraphs explaining the concept's purpose and its role in the
architecture. Mention relevant patterns (CQRS, DDD, EDA, hexagonal,
clean architecture, vertical slices, sans-I/O, SOLID).

## Interface

\`\`\`typescript
// Key exported type or interface signature (not exhaustive)
\`\`\`

## Usage

\`\`\`typescript
// Example pulled from examples/ files if they exist; inline otherwise
\`\`\`

## Diagram

\`\`\`mermaid
// Only include if it adds clarity
\`\`\`

## Related

- **Examples**: [`path/to/example.ts`](../relative/path)
- **Tests**: [`ConceptName.test.ts`](../ConceptName.test.ts)
- **Utils**: [`createConcept`](./createConcept.md), [`isConcept`](./isConcept.md)
- **Used by**: [`DependentConcept`](../other/docs/DependentConcept.md)
```

---

## Verification checklist

Before presenting the doc to the user:
- [ ] Every link in "Related" resolves to a real file
- [ ] Mermaid syntax is valid (no missing `end`, mismatched arrows, etc.)
- [ ] "What it is" mentions at least one relevant architecture pattern
- [ ] Usage example is pulled from an existing `examples/` file, or is a
      minimal inline example if none exists
