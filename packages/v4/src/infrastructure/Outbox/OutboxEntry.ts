import type { DomainEvent } from '@domain/DomainEvent.ts'

export interface OutboxEntry {
  id: string
  event: DomainEvent
  published: boolean
  retryCount: number
  lastAttemptAt?: string
}
