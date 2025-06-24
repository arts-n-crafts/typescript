import type { DomainEvent, DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserActivatedPayload { }

export function UserActivated(aggregateId: string, props: UserActivatedPayload, metadata?: Partial<DomainEventMetadata>): DomainEvent<UserActivatedPayload> {
  return createDomainEvent('UserActivated', aggregateId, props, metadata)
}
