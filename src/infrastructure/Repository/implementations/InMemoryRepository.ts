import type { Repository } from '@domain/Repository.ts'
import type { EventStore } from '../../EventStore/EventStore.ts'

export class InMemoryRepository<TEvent> implements Repository<TEvent> {
  constructor(
    protected readonly eventStore: EventStore<TEvent>,
  ) {
  }

  async load(aggregateId: string): Promise<TEvent[]> {
    return this.eventStore.loadEvents(aggregateId)
  }

  async store(events: TEvent[]): Promise<void> {
    await Promise.all(events.map(async (event) => {
      return this.eventStore.store(event)
    }))
  }
}
