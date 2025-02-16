import { describe, it, expect, beforeEach } from "vitest";
import { MockUserNameUpdatedEvent, type MockUserNameUpdatedEventProps } from "./mocks/MockUserNameUpdated";
import { DomainEvent, type DomainEventMetadataProps } from "./DomainEvent";

describe('DomainEvent', () => {
  let aggregateId: string;
  let payload: MockUserNameUpdatedEventProps;
  let metadata: DomainEventMetadataProps;

  beforeEach(() => {
    aggregateId = '123'
    payload = { name: 'test' }
    metadata = { causationId: '321' }
  })

  it('should be defined', () => {
    expect(DomainEvent).toBeDefined();
  })

  it('should create an instance', () => {
    const event = new MockUserNameUpdatedEvent(aggregateId, payload);
    event.applyMetadata(metadata);
    expect(event).toBeInstanceOf(MockUserNameUpdatedEvent);
  });

  it('should contain the valid information', () => {
    const event = new MockUserNameUpdatedEvent(aggregateId, payload);
    event.applyMetadata(metadata);
    expect(event.payload.name).toBe('test');
    expect(event.metadata?.causationId).toBe('321');
  });
});
