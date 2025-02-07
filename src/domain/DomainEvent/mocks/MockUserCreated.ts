import { DomainEvent } from "../DomainEvent";

export interface MockUserCreatedProps {
  name: string;
  email: string;
  age?: number;
}

export class MockUserCreatedEvent extends DomainEvent<MockUserCreatedProps> { }
