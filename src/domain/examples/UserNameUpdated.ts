import type { DomainEventMetadata } from '../DomainEvent.ts'
import { createDomainEvent } from '../utils/createDomainEvent.ts'

export interface UserNameUpdatedPayload {
  name: string
}

export function UserNameUpdated(aggregateId: string, props: UserNameUpdatedPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserNameUpdated', aggregateId, props, metadata)
}
