import { describe, it, expect, beforeEach } from "vitest";
import { MockRepository } from "./mocks/MockRepository";
import type { EventStore } from "../EventStore/EventStore";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import { MockUserNameUpdatedEvent } from "../../domain/DomainEvent/mocks/MockUserNameUpdated";
import { MockUser } from "../../domain/AggregateRoot/mocks/MockUser";

describe('Repository', () => {
  let aggregateId: string;
  let eventStore: EventStore;
  let event: MockUserNameUpdatedEvent;
  let aggregateRoot: MockUser;

  beforeEach(() => {
    aggregateId = '123';
    eventStore = new InMemoryEventStore();
    event = new MockUserNameUpdatedEvent( '123', {name: 'musk'}, );
    aggregateRoot = MockUser.create({ name: 'elon', email: 'elon@x.com', }, aggregateId);
    aggregateRoot.apply(event);
  });

  it('should be defined', () => {
    expect(MockRepository).toBeDefined();
  })

  it('should be able to load all events of an aggregate', () => {
    const repository = new MockRepository(eventStore);
    expect(repository.load).toBeDefined();
  });

  it('should be able to store a new event from an aggregate', async () => {
    const repository = new MockRepository(eventStore);
    repository.store(aggregateRoot);
    const events = await eventStore.loadEvents(aggregateId)
    expect(events[1]).toStrictEqual(event);
    expect(events).toHaveLength(2);
  });
});
