import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserActivatedPayload { }

export function UserActivated(aggregateId: string, sequenceNumber: number, props: UserActivatedPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserActivated', aggregateId, sequenceNumber, props, metadata)
}
