import type { IDomainEvent } from "../../DomainEvent/DomainEvent";
import { MockDomainEvent } from "../../DomainEvent/mocks/MockDomainEvent";
import { AggregateRoot } from "../AggregateRoot";

interface MockUserProps {
  username: string;
  email: string;
}

export class MockUser extends AggregateRoot<MockUserProps> {
  static create(props: MockUserProps, id: string) {
    return new MockUser(props, id);
  }

  protected applyEvent(event: IDomainEvent): void {
    if (event instanceof MockDomainEvent) {
      this.props.username = event.payload.name;
    }
  }
}
