import type { DomainEventMetadata } from '../DomainEvent.ts'
import { createDomainEvent } from '../utils/createDomainEvent.ts'

export interface UserRegistrationEmailSentPayload {
  status: 'SUCCESS' | 'FAILED'
}

export function UserRegistrationEmailSent(aggregateId: string, props: UserRegistrationEmailSentPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserRegistrationEmailSent', aggregateId, props, metadata)
}
