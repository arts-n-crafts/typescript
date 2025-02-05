import { describe, it, expect, beforeEach } from "vitest";
import { MockDomainEvent, type MockDomainEventMetadata, type MockDomainEventProps } from "./mocks/MockDomainEvent";
import { DomainEvent } from "./DomainEvent";

describe('DomainEvent', () => {
  let aggregateId: string;
  let payload: MockDomainEventProps;
  let timestamp: Date;
  let metadata: MockDomainEventMetadata;

  beforeEach(() => {
    aggregateId = '123'
    payload = { name: 'test' }
    timestamp = new Date()
    metadata = { timestamp, causationId: '321' }
  })

  it('should be defined', () => {
    expect(DomainEvent).toBeDefined();
  })

  it('should create an instance', () => {
    const command = new MockDomainEvent(aggregateId, payload, metadata);
    expect(command).toBeInstanceOf(MockDomainEvent);
  });

  it('should contain the valid information', () => {
    const command = new MockDomainEvent(aggregateId, payload, metadata);
    expect(command.payload.name).toBe('test');
    expect(command.metadata.causationId).toBe('321');
  });
});
