import type { BaseEvent } from '@domain/BaseEvent.js'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.js'
import type { EventStore } from '../EventStore.ts'

export interface OutboxEntry {
  id: string
  event: DomainEvent<unknown>
  published: boolean
}

export class InMemoryEventStore implements EventStore {
  private outbox: OutboxEntry[] = []
  private store = new Map<string, DomainEvent<unknown>[]>()

  constructor(private readonly eventBus: EventBus<BaseEvent<unknown>>) {
  }

  async load<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: string): Promise<TEvent[]> {
    const events = this.store.get(streamKey)
    return [...(events || [])] as TEvent[]
  }

  async append<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: string, events: TEvent[]): Promise<void> {
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
