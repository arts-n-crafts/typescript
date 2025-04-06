import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserContractSignedPayload { }

export function UserContractSigned(aggregateId: string, props: UserContractSignedPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserContractSigned', aggregateId, props, metadata)
}
