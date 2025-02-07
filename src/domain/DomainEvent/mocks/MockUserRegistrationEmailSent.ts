import { DomainEvent } from "../DomainEvent";

export interface MockUserRegistrationEmailSentProps {
  status: 'SUCCESS' | 'FAILED';
}

export class MockUserRegistrationEmailSentEvent
  extends DomainEvent<MockUserRegistrationEmailSentProps> { }
