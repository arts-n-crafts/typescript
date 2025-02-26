import { DomainEvent } from '../DomainEvent'

export interface UserCreatedEventProps {
  name: string
  email: string
  age?: number
}

export class UserCreatedEvent extends DomainEvent<UserCreatedEventProps> { }
