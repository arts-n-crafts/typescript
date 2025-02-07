import { DomainEvent } from "../../DomainEvent/DomainEvent";
import { MockUserNameUpdatedEvent } from "../../DomainEvent/mocks/MockUserNameUpdated";
import { MockUserCreatedEvent } from "../../DomainEvent/mocks/MockUserCreated";
import { AggregateRoot } from "../AggregateRoot";

export interface MockUserProps {
  name: string;
  email: string;
  age?: number;
}

export class MockUser extends AggregateRoot<MockUserProps> {
  static create(props: MockUserProps, id: string) {
    const aggregate = new MockUser(props, id);
    aggregate.apply(new MockUserCreatedEvent(id, props))
    return aggregate;
  }

  static rehydrate(aggregateId: string, events: DomainEvent<unknown>[]): MockUser {
    const creationEvent = events.shift();
    if (!(creationEvent instanceof MockUserCreatedEvent)) {
      throw new Error('Invalid creation event found');
    }
    const aggregate = new MockUser(creationEvent.payload, aggregateId);
    events.forEach(event => aggregate._applyEvent(event));
    return aggregate;
  }

  protected _applyEvent(event: DomainEvent<unknown>): void {
    if (event instanceof MockUserNameUpdatedEvent) {
      this.props.name = event.payload.name;
    }
  }
}
