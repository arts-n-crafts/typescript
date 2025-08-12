# @arts-and-crafts

> Arts and Crafts was a reaction against the industrialization and excess of the Victorian era, and it sought to celebrate traditional craftsmanship and materials. Arts and Crafts architecture is characterized by a simple and functional design, the use of natural materials, and a focus on craftsmanship.

## Why

To provide structure and organization to your codebase, making it easier to understand (maintainable), test (testable), adapt (flexible), scale (scalable) and withstand failure (robust).

### Simplicity

The idea here is that a web application (hereafter, a system) has three types of entrypoints. The actor could be a producer making a POST request (a command), or a consumer retrieving data via a GET request (a query). The actor could also be a publisher sending a message (an event). To summarize, the entrypoints are:
- Commands;
- Queries, and
- Events.

### Usecases

Based on the idea of a system consisting of only having to handle commands, queries and events, we can provide a clear separation of concerns. This allows us to focus on each type of entrypoint independently, making it easier to reason about and maintain the codebase.

So, each entrypoint is a separate usecase. Thus, in a organized and structured system, each usecase is independent of other usecases (decoupled) and the usecase itself should contain all its required logic.

### Modularity

Modularity is a key principle in software development. It involves breaking down a system into smaller, independent modules that can be developed, tested, and maintained separately.

Usecases belong to a specific domain. Domains are organized as separate modules, each responsible for a specific aspect of the system, often also with their own terminology and domain-specific language.

Domains consist of behavior (usecases). These usecases could be part of a workflow. Workflows could cross multiple domains.

### Workflows

Workflows are a way to organize usecases into a sequence of steps. Each step in a workflow is a usecase. Workflows can be used to model complex business processes.

### System design

Event-Storming

## Installation



## Contributing

This codebase is written in TypeScript and uses Bun as the runtime.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run test
```

This project was created using `bun init` in bun v1.2.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
