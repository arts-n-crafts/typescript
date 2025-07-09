import type { DomainEvent } from '@domain/DomainEvent.js'
import type { Repository } from '@domain/Repository.ts'
import type { EventStore } from '../../EventStore/EventStore.ts'
import { makeStreamId } from '@utils/streamId/makeStreamId.js'

export abstract class InMemoryRepository<TEvent extends DomainEvent<TEvent['payload']>> implements Repository<TEvent> {
  abstract readonly stream: string

  constructor(
    protected readonly eventStore: EventStore,
  ) {
  }

  async load(streamId: string): Promise<TEvent[]> {
    return this.eventStore.load<TEvent>(streamId)
  }

  async store(events: TEvent[]): Promise<void> {
    await Promise.all(events.map(async (event) => {
      return this.eventStore.append(makeStreamId(this.stream, event.aggregateId), events)
    }))
  }
}
