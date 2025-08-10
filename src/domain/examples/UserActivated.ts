import type { DomainEvent, DomainEventMetadata } from '@domain/DomainEvent.ts'
import { createDomainEvent } from '@domain/utils/createDomainEvent.ts'

export interface UserActivatedPayload { }

export function createUserActivatedEvent(aggregateId: string, props: UserActivatedPayload, metadata?: Partial<DomainEventMetadata>): DomainEvent<UserActivatedPayload> {
  return createDomainEvent('UserActivated', aggregateId, props, metadata)
}

export type UserActivatedEvent = ReturnType<typeof createUserActivatedEvent>
