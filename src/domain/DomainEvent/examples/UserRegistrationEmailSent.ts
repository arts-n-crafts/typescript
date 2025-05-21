import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserRegistrationEmailSentPayload {
  status: 'SUCCESS' | 'FAILED'
}

export function UserRegistrationEmailSent(aggregateId: string, sequenceNumber: number, props: UserRegistrationEmailSentPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserRegistrationEmailSent', aggregateId, sequenceNumber, props, metadata)
}
