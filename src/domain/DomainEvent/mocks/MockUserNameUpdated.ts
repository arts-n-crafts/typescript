import { DomainEvent } from "../DomainEvent";

export interface MockUserNameUpdatedEventProps {
  name: string;
}

export class MockUserNameUpdatedEvent extends DomainEvent<MockUserNameUpdatedEventProps> { }
