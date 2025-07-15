import type { DomainEvent } from '@domain/DomainEvent.ts'

export interface OutboxEntry {
  id: string
  event: DomainEvent<any>
  published: boolean
}
