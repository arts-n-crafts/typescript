import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "./EventBus";
import { MockUserCreatedEvent } from "../../domain/DomainEvent/mocks/MockUserCreated";
import { MockUserCreatedEventHandler } from "./mocks/MockUserCreatedEventHandler";
import type { EventStore } from "../EventStore/EventStore";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";

describe("EventBus", () => {
  let eventBus: EventBus;
  let eventStore: EventStore;
  let mockUserCreatedEventHandler: MockUserCreatedEventHandler;

  beforeEach(() => {
    eventBus = new EventBus();
    eventStore = new InMemoryEventStore();
    mockUserCreatedEventHandler = new MockUserCreatedEventHandler(eventStore);
  });

  it("should be defined", () => {
    expect(EventBus).toBeDefined()
  });

  it('should be able subscribe to events', () => {
    eventBus.subscribe(MockUserCreatedEvent.constructor.name, mockUserCreatedEventHandler);
  });
});
