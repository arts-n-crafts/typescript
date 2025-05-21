import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserNameUpdatedPayload {
  name: string
}

export function UserNameUpdated(aggregateId: string, sequenceNumber: number, props: UserNameUpdatedPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserNameUpdated', aggregateId, sequenceNumber, props, metadata)
}
