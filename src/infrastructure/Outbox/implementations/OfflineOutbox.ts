import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Outbox } from '../Outbox.ts'
import type { OutboxEntry } from '../OutboxEntry.ts'

export class OfflineOutbox implements Outbox {
  async enqueue(_event: DomainEvent<unknown>): Promise<void> {
    throw new Error('Could not enqueue, outbox offline!')
  }

  async getPending(_limit = 100): Promise<OutboxEntry[]> {
    throw new Error('Could not getPending, outbox offline!')
  }

  async markAsPublished(_id: string): Promise<void> {
    throw new Error('Could not markAsPublished, outbox offline!')
  }

  async markAsFailed(_id: string): Promise<void> {
    throw new Error('Could not markAsFailed, outbox offline!')
  }
}
