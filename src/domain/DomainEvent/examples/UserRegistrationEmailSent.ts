import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserRegistrationEmailSentPayload {
  status: 'SUCCESS' | 'FAILED'
}

export function UserRegistrationEmailSent(aggregateId: string, props: UserRegistrationEmailSentPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserRegistrationEmailSent', aggregateId, props, metadata)
}
