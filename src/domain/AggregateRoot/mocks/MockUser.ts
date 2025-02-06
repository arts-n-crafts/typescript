import type { IDomainEvent } from "../../DomainEvent/DomainEvent";
import { MockUserNameUpdatedEvent } from "../../DomainEvent/mocks/MockUserNameUpdated";
import { MockUserCreated } from "../../DomainEvent/mocks/MockUserCreated";
import { AggregateRoot } from "../AggregateRoot";

export interface MockUserProps {
  name: string;
  email: string;
  age?: number;
}

export class MockUser extends AggregateRoot<MockUserProps> {
  static create(props: MockUserProps, id: string) {
    const aggregate = new MockUser(props, id);
    aggregate.apply(new MockUserCreated(id, props))
    return aggregate;
  }

  static rehydrate(aggregateId: string, events: IDomainEvent[]): MockUser {
    const aggregate = new MockUser({ name: "", email: "" }, aggregateId);
    events.forEach(event => aggregate.apply(event));
    return aggregate;
  }

  protected _applyEvent(event: IDomainEvent): void {
    if (event instanceof MockUserNameUpdatedEvent) {
      this.props.name = event.payload.name;
    }
  }
}
