import type { DomainEvent, DomainEventMetadata } from '@domain/DomainEvent.ts'
import { createDomainEvent } from '@domain/utils/createDomainEvent.ts'

export interface UserNameUpdatedPayload {
  name: string
}

export function createUserNameUpdatedEvent(aggregateId: string, props: UserNameUpdatedPayload, metadata?: Partial<DomainEventMetadata>): DomainEvent<UserNameUpdatedPayload> {
  return createDomainEvent('UserNameUpdated', aggregateId, 'User', props, metadata)
}

export type UserNameUpdatedEvent = ReturnType<typeof createUserNameUpdatedEvent>
