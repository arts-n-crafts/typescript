import type { DomainEvent, DomainEventMetadata } from '@domain/DomainEvent.ts'
import { createDomainEvent } from '@domain/utils/createDomainEvent.ts'

export interface UserRegistrationEmailSentPayload {
  status: 'SUCCESS' | 'FAILED'
}

export function createUserRegistrationEmailSent(
  aggregateId: string,
  props: UserRegistrationEmailSentPayload,
  metadata?: Partial<DomainEventMetadata>,
): DomainEvent<UserRegistrationEmailSentPayload> {
  return createDomainEvent('UserRegistrationEmailSent', aggregateId, props, metadata)
}

export type UserRegistrationEmailSentEvent = ReturnType<typeof createUserRegistrationEmailSent>
