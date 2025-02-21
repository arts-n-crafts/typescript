import { DomainEvent } from '../DomainEvent'

export interface MockUserCreatedEventProps {
  name: string
  email: string
  age?: number
}

export class MockUserCreatedEvent extends DomainEvent<MockUserCreatedEventProps> { }
