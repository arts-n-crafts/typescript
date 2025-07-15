import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { StreamKey } from '@utils/streamKey/index.js'
import type { EventStore } from '../EventStore.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { createStoredEvent } from '../utils/createStoredEvent.ts'

export class InMemoryEventStore implements EventStore {
  private currentId: number = 0
  private store = new Map<StreamKey, StoredEvent<DomainEvent<unknown>>[]>()

  constructor(private readonly outbox?: Outbox) {}

  async load<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey): Promise<TEvent[]> {
    const storedEvents = this.store.get(streamKey) as StoredEvent<TEvent>[] | []
    return storedEvents?.map(storedEvent => storedEvent.event) ?? []
  }

  async append<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey, events: TEvent[]): Promise<void> {
    const storedEvents = this.store.get(streamKey) || []

    const eventsToStore = events.map(event => createStoredEvent(streamKey, this.currentId++, event))
    this.store.set(streamKey, [...storedEvents, ...eventsToStore])

    await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
  }
}
