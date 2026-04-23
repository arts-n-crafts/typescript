# ADR-0000: MADR Template for ADR

---
status: accepted

date: 2026-02-22

decision-makers: []
---

---

## Template

```markdown
---
status: "{proposed | rejected | accepted | deprecated | superseded by ADR-XXXX}"
date: {YYYY-MM-DD}
decision-makers: {list everyone involved in the decision}
consulted: {list everyone whose opinions are sought}   <!-- optional -->
informed: {list everyone kept up-to-date}              <!-- optional -->
---

# ADR-XXXX: {short title}

## Context and Problem Statement

{Describe the context and problem. Two to three sentences, or a question.}

## Decision Drivers

* {driver 1}
* {driver 2}

## Considered Options

1. {option 1}
2. {option 2}
3. {option 3}

## Decision Outcome

Chosen option: "{option 1}", because {justification}.

### Consequences

* Good, because {positive consequence}
* Bad, because {negative consequence}
* Neutral, because {neutral consequence}

### Confirmation

{How can compliance with this decision be confirmed? Code review, test, ArchUnit rule, etc.}

## Pros and Cons of the Options

### {option 1}

* Good, because {argument a}
* Neutral, because {argument b}
* Bad, because {argument c}

### {option 2}

* Good, because {argument a}
* Neutral, because {argument b}
* Bad, because {argument c}

## Diagram

\`\`\`mermaid
// Only include if it genuinely clarifies a flow or structure.
// Good candidates: command lifecycle sequence, state machine, relay trigger chain.
\`\`\`

## More Information

{Additional evidence, links to related ADRs, resources, or notes on when to revisit.}
```

---

## Rules

1. **File naming.** Use `NNNN-kebab-case-title.md` in `docs/adr/`. Increment from the last ADR.

2. **Frontmatter.** Always set `status` and `date`. `consulted` and `informed` are optional.

3. **Status values.** Use one of: `proposed`, `rejected`, `accepted`, `deprecated`, `superseded by ADR-XXXX`.

4. **Context and Problem Statement.** Describe the situation and why a decision is needed. Do not include the decision itself.

5. **Considered Options.** List at least two. If only one was realistic, explain why alternatives were ruled out quickly.

6. **Decision Outcome.** State the chosen option and key reason in one sentence.

7. **Consequences.** Use `Good, because` / `Bad, because` / `Neutral, because` bullets. At least one Good and one Bad.

8. **Pros and Cons of the Options.** Weigh each option individually. Use the same Good/Bad/Neutral pattern.

9. **Mermaid diagrams.** Add a `## Diagram` section only when it genuinely clarifies a flow — command lifecycle sequences, state machines, relay trigger chains. Skip for simple decisions. Verify syntax is valid before finalising.

10. **Code examples.** Use Rust (`.rs`) when illustrating structure or patterns.

11. **Architecture patterns.** Where relevant, name the patterns the decision embodies: FCIS, vertical slices, ports and adapters, event sourcing, CQRS, outbox, saga.

12. **Update the index.** Add the new ADR to the table in `docs/adr/architecture-summary.md`.

---

## Verification checklist

Before finalising an ADR:

- [ ] Frontmatter is complete (status, date, decision-makers)
- [ ] At least two options listed in Considered Options
- [ ] Decision Outcome names the chosen option with justification
- [ ] Consequences has at least one Good and one Bad bullet
- [ ] Pros and Cons weighs each option
- [ ] Mermaid syntax is valid, or Diagram section is omitted
- [ ] Entry added to the ADR index in `architecture-summary.md`
- [ ] Cross-references to other ADRs use the `ADR-XXXX` format
