import type { DomainEvent } from '@domain/index.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { StreamKey } from '@utils/index.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { makeStreamKey } from '@utils/index.ts'
import { createStoredEvent } from '../utils/createStoredEvent.ts'
import { MultipleAggregatesException } from './SimpleEventStore.exceptions.ts'

export class SimpleEventStore<TEvent extends DomainEvent> implements EventStore<TEvent, Promise<void>, Promise<TEvent[]>> {
  private readonly tableName: string = 'event_store'

  constructor(
    private readonly database: Database<StoredEvent<TEvent>, Promise<void>, Promise<StoredEvent<TEvent>[]>>,
    private readonly outbox?: Outbox,
  ) { }

  async load(streamName: string, aggregateId: string): Promise<TEvent[]> {
    const streamKey: StreamKey = makeStreamKey(streamName, aggregateId)
    const specification = new FieldEquals('streamKey', streamKey)
    const storedEvents = await this.database.query(this.tableName, specification)
    return storedEvents.map(storedEvent => storedEvent.event)
  }

  async append(streamName: string, events: TEvent[]): Promise<void> {
    const uniqueAggregateIds = new Set(events.map(event => event.aggregateId))
    if (uniqueAggregateIds.size > 1)
      throw new MultipleAggregatesException()

    const event = events[0]
    const currentStream = await this.load(streamName, event.aggregateId)
    const eventsToStore = events
      .map(event => createStoredEvent(streamName, currentStream.length + 1, event))
    await Promise.all(
      eventsToStore.map(async payload => this.database.execute(this.tableName, { operation: Operation.CREATE, payload }),
      ),
    )
    await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
  }
}
