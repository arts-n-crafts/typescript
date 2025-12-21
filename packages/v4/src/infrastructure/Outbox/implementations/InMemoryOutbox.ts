import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Outbox } from '../Outbox.ts'
import type { OutboxEntry } from '../OutboxEntry.ts'
import { getTimestamp } from '@core/utils/getTimestamp.ts'

export class InMemoryOutbox implements Outbox {
  protected entries: OutboxEntry[] = []
  protected idCounter = 0

  async enqueue(event: DomainEvent<unknown>): Promise<void> {
    this.entries.push({
      id: (this.idCounter++).toString(),
      event,
      published: false,
      retryCount: 0,
    })
  }

  async getPending(limit = 100): Promise<OutboxEntry[]> {
    return this.entries.filter(e => !e.published).slice(0, limit)
  }

  async markAsPublished(id: string): Promise<void> {
    const entry = this.entries.find(e => e.id === id)
    if (entry) {
      entry.published = true
    }
  }

  async markAsFailed(id: string): Promise<void> {
    const entry = this.entries.find(e => e.id === id)
    if (entry) {
      entry.retryCount += 1
      entry.lastAttemptAt = getTimestamp()
    }
  }
}
