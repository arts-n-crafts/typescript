import type { OutboxEntry } from '@infrastructure/Outbox/OutboxEntry.ts'

export interface Outbox {
  enqueue: (event: OutboxEntry['event']) => Promise<void>
  getPending: (limit?: number) => Promise<OutboxEntry[]>
  markAsPublished: (id: string) => Promise<void>
  markAsFailed: (id: string) => Promise<void>
}
