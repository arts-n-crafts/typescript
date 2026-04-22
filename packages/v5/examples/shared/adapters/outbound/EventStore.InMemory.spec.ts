import type { LoadsDomainEvents } from "@adapters/outbound/LoadsDomainEvents.ts";
import type { DomainEvent } from "@core/shapes/DomainEvent.ts";
import { InMemoryEventStore } from "./EventStore.InMemory.ts";
import { randomUUID } from "node:crypto";
import type { AppendsDomainEvents } from "@adapters/outbound/AppendsDomainEvents.ts";

interface TestDomainEvent extends DomainEvent<"TestDomainEvent", { name: string }> {}

describe("in-memory event store", () => {
  const aggregateId = randomUUID();
  const streamName = "users";
  let eventStore: LoadsDomainEvents<Promise<TestDomainEvent[]>> &
    AppendsDomainEvents<TestDomainEvent>;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
  });

  it("should be defined", () => {
    expect(InMemoryEventStore).toBeDefined();
  });

  it("should load domain events", async () => {
    const events = await eventStore.load(streamName, aggregateId);
    expect(events).toEqual([]);
  });

  it("should append domain events", async () => {
    const events = await eventStore.append(aggregateId, []);
    expect(events).toEqual(undefined);
  });
});
