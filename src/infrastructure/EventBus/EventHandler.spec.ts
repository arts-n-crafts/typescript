import { describe, it, expect, beforeEach } from "vitest";
import { EventHandler } from "./EventHandler";
import { MockUserCreatedEventHandler } from "./mocks/MockUserCreatedEventHandler";
import { MockUserCreatedEvent, type MockUserCreatedEventProps } from "../../domain/DomainEvent/mocks/MockUserCreated";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import type { EventStore } from "../EventStore/EventStore";
import { MockUserRegistrationEmailSentEvent } from "../../domain/DomainEvent/mocks/MockUserRegistrationEmailSent";
import { EventBus } from "./EventBus";

describe('EventHandler', () => {
  let eventBus: EventBus;
  let eventStore: EventStore;
  let handler: MockUserCreatedEventHandler;
  let aggregateId: string;
  let payload: MockUserCreatedEventProps;

  beforeEach(() => {
    eventBus = new EventBus();
    eventStore = new InMemoryEventStore(eventBus);
    handler = new MockUserCreatedEventHandler(eventStore);
    aggregateId = '123'
    payload = { name: 'test', email: 'musk@x.com' }
  })

  it('should be defined', () => {
    expect(EventHandler).toBeDefined();
  });

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = new MockUserCreatedEvent(aggregateId, payload);
    await handler.handle(event);
    const events = await eventStore.loadEvents(aggregateId);
    const sentEvent = events[0] as MockUserRegistrationEmailSentEvent;
    expect(sentEvent).toBeInstanceOf(MockUserRegistrationEmailSentEvent)
    expect(sentEvent.payload?.status).toBe('SUCCESS');
  })
});
