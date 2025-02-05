import { describe, it, expect, beforeEach } from "vitest";
import { AggregateRoot } from "./AggregateRoot";
import { MockUser, type MockUserProps } from "./mocks/MockUser";
import { MockDomainEvent } from "../DomainEvent/mocks/MockDomainEvent";

describe("AggregateRoot", () => {
  let id: string;
  let props: MockUserProps;
  let event: MockDomainEvent;
  let aggregateRoot: MockUser;
  
  beforeEach(() => { 
    id = '123';
    props = { username: 'elon', email: 'elon@x.com', }
    event = new MockDomainEvent(
      '123',
      {name: 'musk'},
      {causationId: '123', timestamp: new Date()}
    );
    aggregateRoot = MockUser.create(props, id);
  })
  
  it("should be defined", () => {
    expect(AggregateRoot).toBeDefined();
  });

  it('should apply the event given', () => {
    aggregateRoot.apply(event);
    expect(aggregateRoot.props.username).toBe('musk');
  });

  it('should push to uncommittedEvents', () => {
    aggregateRoot.apply(event);
    expect(aggregateRoot.uncommittedEvents).toStrictEqual([event]);
  })

  it('should mark events as committed by clearing uncommittedEvents', () => {
    aggregateRoot.apply(event);
    expect(aggregateRoot.uncommittedEvents).toStrictEqual([event]);
    aggregateRoot.markEventsCommitted();
    expect(aggregateRoot.uncommittedEvents).toStrictEqual([]);
  })
});
