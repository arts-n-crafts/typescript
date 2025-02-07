import { describe, it, expect, beforeEach } from "vitest";
import { AggregateRoot } from "./AggregateRoot";
import { MockUser, type MockUserProps } from "./mocks/MockUser";
import { MockUserNameUpdatedEvent } from "../DomainEvent/mocks/MockUserNameUpdated";
import type { IDomainEvent } from "../DomainEvent/DomainEvent";
import { MockUserCreatedEvent } from "../DomainEvent/mocks/MockUserCreated";

describe("AggregateRoot", () => {
  let id: string;
  let props: MockUserProps;
  let mockUserCreatedEvent: MockUserCreatedEvent;
  let mockUserNameUpdatedEvent: MockUserNameUpdatedEvent;
  let aggregateRoot: MockUser;

  beforeEach(() => {
    id = '123';
    props = { name: 'elon', email: 'elon@x.com', }
    mockUserCreatedEvent = new MockUserCreatedEvent( '123', props );
    mockUserNameUpdatedEvent = new MockUserNameUpdatedEvent( '123', {name: 'musk'} );
    aggregateRoot = MockUser.create(props, id);
  })

  it("should be defined", () => {
    expect(AggregateRoot).toBeDefined();
  });

  it('should apply the event given', () => {
    aggregateRoot.apply(mockUserNameUpdatedEvent);
    expect(aggregateRoot.props.name).toBe('musk');
  });

  it('should push to uncommittedEvents', () => {
    aggregateRoot.apply(mockUserNameUpdatedEvent);
    expect(aggregateRoot.uncommittedEvents[1]).toStrictEqual(mockUserNameUpdatedEvent);
  })

  it('should mark events as committed by clearing uncommittedEvents', () => {
    aggregateRoot.apply(mockUserNameUpdatedEvent);
    expect(aggregateRoot.uncommittedEvents[1]).toStrictEqual(mockUserNameUpdatedEvent);
    aggregateRoot.markEventsCommitted();
    expect(aggregateRoot.uncommittedEvents).toStrictEqual([]);
  })

  it('should do nothing on an unhandled event', () => {
    const unhandledEvent: IDomainEvent = {
      aggregateId: "4321",
      payload: mockUserNameUpdatedEvent.payload,
      metadata: undefined
    };
    aggregateRoot.apply(unhandledEvent);
    expect(aggregateRoot.props.name).toBe('elon');
  })

  it('should rehydrate events', () => {
    const aggregate = MockUser.rehydrate(id, [mockUserCreatedEvent, mockUserNameUpdatedEvent]);
    expect(aggregate.props.name).toBe('musk');
  })

  it('should not rehydrate if there is no creation event', () => {
    expect(() => MockUser.rehydrate(id, [mockUserNameUpdatedEvent])).toThrow();
  })
});
