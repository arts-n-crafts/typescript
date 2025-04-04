import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../createDomainEvent'

export interface UserNameUpdatedPayload {
  name: string
}

export function UserNameUpdated(aggregateId: string, props: UserNameUpdatedPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserNameUpdated', aggregateId, props, metadata, 2)
}
