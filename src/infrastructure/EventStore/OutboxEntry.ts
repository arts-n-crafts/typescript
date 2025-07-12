import type { DomainEvent } from '@domain/DomainEvent.ts'

export interface OutboxEntry {
  id: string
  event: DomainEvent<unknown>
  published: boolean
}
