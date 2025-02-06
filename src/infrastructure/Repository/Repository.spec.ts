import { describe, it, expect, beforeEach } from "vitest";
import { MockRepository } from "./mocks/MockRepository";
import type { EventStore } from "../EventStore/EventStore";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import { MockDomainEvent } from "../../domain/DomainEvent/mocks/MockDomainEvent";
import { MockUser } from "../../domain/AggregateRoot/mocks/MockUser";

describe('Repository', () => {
  let aggregateId: string;
  let eventStore: EventStore;
  let event: MockDomainEvent;
  let aggregateRoot: MockUser;

  beforeEach(() => {
    aggregateId = '123';
    eventStore = new InMemoryEventStore();
    event = new MockDomainEvent(
      '123',
      {name: 'musk'},
      {causationId: '123', timestamp: new Date()}
    );
    aggregateRoot = MockUser.create({ username: 'elon', email: 'elon@x.com', }, aggregateId);
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
    expect(events).toStrictEqual([event]);
  });
});
