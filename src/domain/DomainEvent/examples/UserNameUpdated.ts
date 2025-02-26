import { DomainEvent } from '../DomainEvent'

export interface UserNameUpdatedEventProps {
  name: string
}

export class UserNameUpdatedEvent extends DomainEvent<UserNameUpdatedEventProps> { }
