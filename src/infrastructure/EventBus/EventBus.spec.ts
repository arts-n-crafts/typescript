import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "./EventBus";
import { MockUserCreatedEventHandler } from "./mocks/MockUserCreatedEventHandler";
import type { EventStore } from "../EventStore/EventStore";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import { MockUserCreatedEvent, type MockUserCreatedEventProps } from "../../domain/DomainEvent/mocks/MockUserCreated";
import { MockUserRegistrationEmailSentEvent } from "../../domain/DomainEvent/mocks/MockUserRegistrationEmailSent";

describe("EventBus", () => {
  let eventBus: EventBus;
  let eventStore: EventStore;
  let handler: MockUserCreatedEventHandler;
  let aggregateId: string;
  let payload: MockUserCreatedEventProps;

  beforeEach(() => {
    eventBus = new EventBus();
    eventStore = new InMemoryEventStore();
    handler = new MockUserCreatedEventHandler(eventStore);
    aggregateId = '123'
    payload = { name: 'test', email: 'musk@x.com' }
  })

  beforeEach(() => {
  });

  it("should be defined", () => {
    expect(EventBus).toBeDefined()
  });

  it('should be able subscribe to events', () => {
    eventBus.subscribe(handler);
  });

  it('should be able publish events', async () => {
    eventBus.subscribe(handler);
    const createdEvent = new MockUserCreatedEvent(aggregateId, payload);
    await eventBus.publish(createdEvent);

    const events = await eventStore.loadEvents(aggregateId);
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata?.causationId === createdEvent.metadata?.eventId);
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy();
    expect(events[sentEventCausedByCreatedEventIndex]).toBeInstanceOf(MockUserRegistrationEmailSentEvent)
  });
});
