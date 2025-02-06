import { describe, it, expect, beforeEach } from "vitest";
import { AggregateRoot } from "./AggregateRoot";
import { MockUser, type MockUserProps } from "./mocks/MockUser";
import { MockUserNameUpdatedEvent } from "../DomainEvent/mocks/MockUserNameUpdated";
import type { IDomainEvent } from "../DomainEvent/DomainEvent";

describe("AggregateRoot", () => {
  let id: string;
  let props: MockUserProps;
  let event: MockUserNameUpdatedEvent;
  let aggregateRoot: MockUser;

  beforeEach(() => {
    id = '123';
    props = { name: 'elon', email: 'elon@x.com', }
    event = new MockUserNameUpdatedEvent(
      '123',
      {name: 'musk'},
    );
    aggregateRoot = MockUser.create(props, id);
  })

  it("should be defined", () => {
    expect(AggregateRoot).toBeDefined();
  });

  it('should apply the event given', () => {
    aggregateRoot.apply(event);
    expect(aggregateRoot.props.name).toBe('musk');
  });

  it('should push to uncommittedEvents', () => {
    aggregateRoot.apply(event);
    expect(aggregateRoot.uncommittedEvents[1]).toStrictEqual(event);
  })

  it('should mark events as committed by clearing uncommittedEvents', () => {
    aggregateRoot.apply(event);
    expect(aggregateRoot.uncommittedEvents[1]).toStrictEqual(event);
    aggregateRoot.markEventsCommitted();
    expect(aggregateRoot.uncommittedEvents).toStrictEqual([]);
  })

  it('should do nothing on an unhandled event', () => {
    const unhandledEvent: IDomainEvent = {
      aggregateId: "4321",
      payload: event.payload,
      metadata: undefined
    };
    aggregateRoot.apply(unhandledEvent);
    expect(aggregateRoot.props.name).toBe('elon');
  })
  
  it('should rehydrate events', () => { 
    const aggregate = MockUser.rehydrate(id, [event]);
    expect(aggregate.props.name).toBe('musk');
  })
});
