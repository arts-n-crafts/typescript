import type { DomainEventMetadata } from '../DomainEvent.ts'
import { createDomainEvent } from '../utils/createDomainEvent.ts'

export interface UserActivatedPayload { }

export function UserActivated(aggregateId: string, props: UserActivatedPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserActivated', aggregateId, props, metadata)
}
