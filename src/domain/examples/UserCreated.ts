import type { DomainEventMetadata } from '../DomainEvent'
import { createDomainEvent } from '../utils/createDomainEvent'

export interface UserCreatedPayload {
  name: string
  email: string
  age?: number
  prospect: boolean
}

export function UserCreated(aggregateId: string, payload: Omit<UserCreatedPayload, 'prospect'>, metadata?: Partial<DomainEventMetadata>) {
  const props: UserCreatedPayload = { prospect: true, ...payload }
  return createDomainEvent('UserCreated', aggregateId, props, metadata)
}
