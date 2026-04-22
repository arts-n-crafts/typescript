import type { LoadsDomainEvents } from "@adapters/outbound/capabilities/LoadsDomainEvents.ts";
import type { DomainEvent } from "@core/shapes/DomainEvent.ts";
import { InMemoryEventStore } from "./EventStore.InMemory.ts";
import type { AppendsDomainEvents } from "@adapters/outbound/capabilities/AppendsDomainEvents.ts";
import { randomUUID } from "node:crypto";

interface TestDomainEvent extends DomainEvent<"TestDomainEvent", { name: string }> {}

describe("in-memory event store", () => {
  const aggregateId = randomUUID();
  const streamName = "users";
  let eventStore: LoadsDomainEvents<Promise<TestDomainEvent[]>> &
    AppendsDomainEvents<TestDomainEvent>;
  const fixture = [
    {
      type: "TestDomainEvent" as const,
      payload: { name: "Elon Musk" },
      kind: "domain" as const,
      aggregateType: streamName,
      aggregateId,
      aggregateVersion: 0,
      timestamp: new Date().getTime(),
      metadata: {
        correlationId: randomUUID(),
        causationId: randomUUID(),
      },
      id: randomUUID(),
    },
    {
      type: "TestDomainEvent" as const,
      payload: { name: "Elon Musk" },
      kind: "domain" as const,
      aggregateType: streamName,
      aggregateId,
      aggregateVersion: 0,
      timestamp: new Date().getTime(),
      metadata: {
        correlationId: randomUUID(),
        causationId: randomUUID(),
      },
      id: randomUUID(),
    },
    {
      type: "TestDomainEvent" as const,
      payload: { name: "Elon Musk" },
      kind: "domain" as const,
      aggregateType: streamName,
      aggregateId,
      aggregateVersion: 0,
      timestamp: new Date().getTime(),
      metadata: {
        correlationId: randomUUID(),
        causationId: randomUUID(),
      },
      id: randomUUID(),
    },
  ];

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
  });

  it("should be defined", () => {
    expect(InMemoryEventStore).toBeDefined();
  });

  it.each([
    { streamName, expected: fixture },
    { streamName: "test", expected: [] },
  ])("should load domain events", async ({ streamName, expected: exoected }) => {
    eventStore.append(fixture);
    const events = await eventStore.load(streamName, aggregateId);
    expect(events).toEqual(exoected);
  });

  it("should not return anything if there were no events appended", async () => {
    const events = await eventStore.load(streamName, aggregateId);
    expect(events).toEqual([]);
  });

  it.each<{ events: TestDomainEvent[] }>([
    {
      events: [
        {
          type: "TestDomainEvent",
          payload: { name: "Elon Musk" },
          kind: "domain",
          aggregateType: streamName,
          aggregateId: randomUUID(),
          aggregateVersion: 0,
          timestamp: new Date().getTime(),
          metadata: {
            correlationId: randomUUID(),
            causationId: randomUUID(),
          },
          id: randomUUID(),
        },
      ],
    },
    {
      events: [
        {
          type: "TestDomainEvent",
          payload: { name: "Elon Musk" },
          kind: "domain",
          aggregateType: streamName,
          aggregateId: randomUUID(),
          aggregateVersion: 0,
          timestamp: new Date().getTime(),
          metadata: {
            correlationId: randomUUID(),
            causationId: randomUUID(),
          },
          id: randomUUID(),
        },
        {
          type: "TestDomainEvent",
          payload: { name: "Elon Musk" },
          kind: "domain",
          aggregateType: streamName,
          aggregateId: randomUUID(),
          aggregateVersion: 0,
          timestamp: new Date().getTime(),
          metadata: {
            correlationId: randomUUID(),
            causationId: randomUUID(),
          },
          id: randomUUID(),
        },
        {
          type: "TestDomainEvent",
          payload: { name: "Elon Musk" },
          kind: "domain",
          aggregateType: streamName,
          aggregateId: randomUUID(),
          aggregateVersion: 0,
          timestamp: new Date().getTime(),
          metadata: {
            correlationId: randomUUID(),
            causationId: randomUUID(),
          },
          id: randomUUID(),
        },
      ],
    },
  ])("should append domain events", async ({ events }) => {
    const result = eventStore.append(events);
    await expect(result).resolves.not.toThrow();
  });

  it("should append events if there were already events appended", async () => {
    eventStore.append(fixture);
    const result = eventStore.append([
      {
        type: "TestDomainEvent" as const,
        payload: { name: "Elon Musk" },
        kind: "domain",
        aggregateType: streamName,
        aggregateId: randomUUID(),
        aggregateVersion: 0,
        timestamp: new Date().getTime(),
        metadata: {
          correlationId: randomUUID(),
          causationId: randomUUID(),
        },
        id: randomUUID(),
      },
    ]);
    await expect(result).resolves.not.toThrow();
  });
});
