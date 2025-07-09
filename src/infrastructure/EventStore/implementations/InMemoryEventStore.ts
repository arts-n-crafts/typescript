import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { EventStore } from '../EventStore.ts'

interface OutboxEntry {
  id: string
  event: DomainEvent<unknown>
  published: boolean
}

export class InMemoryEventStore implements EventStore {
  private store = new Map<string, DomainEvent<unknown>[]>()
  private outbox: OutboxEntry[] = []

  async load<TEvent extends DomainEvent<TEvent['payload']>>(streamId: string): Promise<TEvent[]> {
    const events = this.store.get(streamId)
    return [...(events || [])] as TEvent[]
  }

  async append<TEvent extends DomainEvent<TEvent['payload']>>(streamId: string, events: TEvent[]): Promise<void> {
    const existing = await this.load(streamId)

    this.store.set(streamId, [...existing, ...events])

    this.outbox.push(
      ...events.map(event => ({ id: event.id, event, published: false })),
    )
  }

  getOutboxBatch(limit = 10): OutboxEntry[] {
    return this.outbox
      .filter(entry => !entry.published)
      .slice(0, limit)
  }

  acknowledgeDispatch(id: string): void {
    const entry = this.outbox.find(e => e.id === id)
    if (entry)
      entry.published = true
  }
}
