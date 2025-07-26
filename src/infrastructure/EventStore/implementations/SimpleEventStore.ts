import type { DomainEvent } from '@domain/index.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { StreamKey } from '@utils/streamKey/StreamKey.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { createStoredEvent } from '../utils/createStoredEvent.ts'
import { MultipleAggregatesException } from './SimpleEventStore.exceptions.ts'

export type SimpleEventStoreResult = { id: string } | void

export class SimpleEventStore<TEvent extends DomainEvent> implements EventStore<TEvent, SimpleEventStoreResult> {
  private readonly tableName: string = 'event_store'

  constructor(
    private readonly database: Database<StoredEvent<TEvent>, SimpleEventStoreResult>,
    private readonly outbox?: Outbox,
  ) { }

  async load(streamKey: StreamKey): Promise<TEvent[]> {
    const specification = new FieldEquals('streamKey', streamKey)
    const storedEvents = await this.database.query(this.tableName, specification)
    return storedEvents.map(storedEvent => storedEvent.event)
  }

  async append(streamKey: StreamKey, events: TEvent[]): Promise<SimpleEventStoreResult> {
    const uniqueAggregateIds = new Set(events.map(event => event.aggregateId))
    if (uniqueAggregateIds.size > 1)
      throw new MultipleAggregatesException()

    const currentStream = await this.load(streamKey)
    const eventsToStore = events
      .map(event => createStoredEvent(streamKey, currentStream.length + 1, event))
    await Promise.all(
      eventsToStore.map(async payload => this.database.execute(this.tableName, { operation: Operation.CREATE, payload }),
      ),
    )
    await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
  }
}
