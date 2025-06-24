import type { DomainEvent, DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserRegistrationEmailSentPayload {
  status: 'SUCCESS' | 'FAILED'
}

export function UserRegistrationEmailSent(aggregateId: string, props: UserRegistrationEmailSentPayload, metadata?: Partial<DomainEventMetadata>): DomainEvent<UserRegistrationEmailSentPayload> {
  return createDomainEvent('UserRegistrationEmailSent', aggregateId, props, metadata)
}
