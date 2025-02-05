import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryEventStore } from "./implementations/InMemoryEventStore";
import type { IDomainEvent } from "../../domain/DomainEvent/DomainEvent";

describe("InMemoryEventStore", () => {
  let eventStore: InMemoryEventStore;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
  });

  it("should store and load an event", async () => {
    const event: IDomainEvent = {
      aggregateId: "123",
      payload: { data: "test" },
      metadata: { timestamp: new Date() },
    };

    await eventStore.store(event);
    const events = await eventStore.loadEvents("123");

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(event);
  });

  it("should store and load multiple events", async () => {
    const event: IDomainEvent = {
      aggregateId: "123",
      payload: { data: "test" },
      metadata: { timestamp: new Date() },
    };
    const event2: IDomainEvent = {
      aggregateId: "123",
      payload: { data: "test2" },
      metadata: { timestamp: new Date() },
    };
    const event3: IDomainEvent = {
      aggregateId: "1234",
      payload: { data: "test3" },
      metadata: { timestamp: new Date() },
    };

    await eventStore.store(event);
    await eventStore.store(event2);
    await eventStore.store(event3);
    const events = await eventStore.loadEvents("123");

    expect(events).toHaveLength(2);
    expect(events[0]).toEqual(event);
    expect(events[1]).toEqual(event2);
  });

  it("should return an empty array if no events are found", async () => {
    const events = await eventStore.loadEvents("non_existent");
    expect(events).toHaveLength(0);
  });
});
