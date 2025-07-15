import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StreamKey } from '@utils/streamKey/index.js'
import type { EventStore } from '../EventStore.ts'
import type { OutboxEntry } from '../OutboxEntry.ts'

export class InMemoryEventStore implements EventStore {
  private outbox: OutboxEntry[] = []
  private store = new Map<StreamKey, DomainEvent<unknown>[]>()

  async load<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey): Promise<TEvent[]> {
    const events = this.store.get(streamKey) as TEvent[] | undefined
    return [...(events || [])]
  }

  async append<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey, events: TEvent[]): Promise<void> {
    const existing = await this.load(streamKey)

    this.store.set(streamKey, [...existing, ...events])

    this.outbox.push(...events.map(event => ({ id: event.id, event, published: false })))
  }

  getOutboxBatch(limit?: number): OutboxEntry[] {
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
