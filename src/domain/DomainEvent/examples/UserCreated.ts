import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserCreatedPayload {
  name: string
  email: string
  age?: number
  contractSigned: boolean
}

export function UserCreated(aggregateId: string, props: UserCreatedPayload, metadata?: Partial<DomainEventMetadata>) {
  return createDomainEvent('UserCreated', aggregateId, props, metadata)
}
