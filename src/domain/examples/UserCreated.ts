import type { DomainEvent, DomainEventMetadata } from '@domain/DomainEvent.ts'
import { createDomainEvent } from '@domain/utils/createDomainEvent.ts'

export interface UserCreatedPayload {
  name: string
  email: string
  age?: number
  prospect: boolean
}

export function UserCreated(aggregateId: string, payload: Omit<UserCreatedPayload, 'prospect'>, metadata?: Partial<DomainEventMetadata>): DomainEvent<UserCreatedPayload> {
  const props: UserCreatedPayload = { prospect: true, ...payload }
  return createDomainEvent('UserCreated', aggregateId, props, metadata)
}
