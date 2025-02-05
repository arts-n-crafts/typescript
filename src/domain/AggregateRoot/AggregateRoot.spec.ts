import { describe, it, expect } from "vitest";
import { AggregateRoot } from "./AggregateRoot";
import { MockUser } from "./mocks/MockUser";
import { MockDomainEvent } from "../DomainEvent/mocks/MockDomainEvent";

describe("AggregateRoot", () => {
  it("should be defined", () => {
    expect(AggregateRoot).toBeDefined();
  });

  it('should apply the event given', () => {
    const id = '123';
    const props = { username: 'elon', email: 'elon@x.com', }
    const aggregateRoot = MockUser.create(props, id);
    const event = new MockDomainEvent(
      '123',
      {name: 'musk'},
      {causationId: '123', timestamp: new Date()}
    );
    aggregateRoot.apply(event);
    expect(aggregateRoot.props.username).toBe('musk');
  });

  it('should push to uncommittedEvents', () => {
    const id = '123';
    const props = { username: 'elon', email: 'elon@x.com', }
    const aggregateRoot = MockUser.create(props, id);
    const event = new MockDomainEvent(
      '123',
      {name: 'musk'},
      {causationId: '123', timestamp: new Date()}
    );
    aggregateRoot.apply(event);
    expect(aggregateRoot.uncommittedEvents).toStrictEqual([event]);
  })
});
