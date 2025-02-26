import { DomainEvent } from '../DomainEvent'

export interface UserRegistrationEmailSentProps {
  status: 'SUCCESS' | 'FAILED'
}

export class UserRegistrationEmailSentEvent
  extends DomainEvent<UserRegistrationEmailSentProps> { }
