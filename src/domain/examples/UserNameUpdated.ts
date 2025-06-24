import type { DomainEvent, DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserNameUpdatedPayload {
  name: string
}

export function UserNameUpdated(aggregateId: string, props: UserNameUpdatedPayload, metadata?: Partial<DomainEventMetadata>): DomainEvent<UserNameUpdatedPayload> {
  return createDomainEvent('UserNameUpdated', aggregateId, props, metadata)
}
