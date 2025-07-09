import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { DomainEvent } from '@domain/DomainEvent.js'
import type { Repository } from '@domain/Repository.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.js'
import type { InMemoryEventStore } from '@infrastructure/EventStore/implementations/InMemoryEventStore.js'
import { makeStreamId } from '@utils/streamId/makeStreamId.js'

export abstract class InMemoryRepository<TEvent extends DomainEvent<TEvent['payload']>> implements Repository<TEvent> {
  abstract readonly stream: string

  constructor(
    protected readonly eventStore: InMemoryEventStore,
    protected readonly eventBus: EventBus<BaseEvent<any>>,
  ) {
  }

  async load(aggregateId: string): Promise<TEvent[]> {
    const streamId = makeStreamId(this.stream, aggregateId)
    return this.eventStore.load<TEvent>(streamId)
  }

  async store(events: TEvent[]): Promise<void> {
    await Promise.all(events.map(async (event) => {
      const streamId = makeStreamId(this.stream, event.aggregateId)
      return this.eventStore.append(streamId, [event])
    }))
    await this.handleOutbox()
  }

  async handleOutbox(): Promise<void> {
    const pendingEntries = this.eventStore.getOutboxBatch()
    await Promise.all(
      pendingEntries.map(async (entry) => {
        this.eventStore.acknowledgeDispatch(entry.id)
        return this.eventBus.publish(entry.event)
      }),
    )
  }
}
