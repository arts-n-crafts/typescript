import type { Repository } from '../../../domain'
import type { EventStore } from '../../EventStore/EventStore'

export class InMemoryRepository<TEvent> implements Repository<TEvent> {
  constructor(
    protected readonly eventStore: EventStore<TEvent>,
  ) {
  }

  async load(aggregateId: string) {
    return this.eventStore.loadEvents(aggregateId)
  }

  async store(events: TEvent[]): Promise<void> {
    await Promise.all(events.map(async (event) => {
      return this.eventStore.store(event)
    }))
  }
}
