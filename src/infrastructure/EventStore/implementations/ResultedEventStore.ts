import type { DomainEvent } from '@domain/index.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { StreamKey } from '@utils/streamKey/StreamKey.ts'
import type { Result } from 'oxide.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { Err, Ok } from 'oxide.ts'
import { createStoredEvent } from '../utils/createStoredEvent.ts'
import { MultipleAggregatesException } from './SimpleEventStore.exceptions.ts'

export type ResultedEventStoreAppendReturnType = Result<{ id: string }, Error>

export class ResultedEventStore<TEvent extends DomainEvent> implements EventStore<TEvent, ResultedEventStoreAppendReturnType, Result<TEvent[], Error>> {
  private readonly tableName: string = 'event_store'

  constructor(
    private readonly database: Database<StoredEvent<TEvent>, ResultedEventStoreAppendReturnType, Result<StoredEvent<TEvent>[], Error>>,
    private readonly outbox?: Outbox,
  ) { }

  async load(streamKey: StreamKey): Promise<Result<TEvent[], Error>> {
    const specification = new FieldEquals('streamKey', streamKey)
    const storedEvents = await this.database.query(this.tableName, specification)
    return Ok(storedEvents.unwrap().map(storedEvent => storedEvent.event))
  }

  async append(streamKey: StreamKey, events: TEvent[]): Promise<ResultedEventStoreAppendReturnType> {
    const uniqueAggregateIds = new Set(events.map(event => event.aggregateId))
    if (uniqueAggregateIds.size > 1)
      return Err(new MultipleAggregatesException())

    const currentStream = await this.load(streamKey)
    const eventsToStore = events
      .map(event => createStoredEvent(streamKey, currentStream.unwrap().length + 1, event))
    await Promise.all(
      eventsToStore.map(async payload => this.database.execute(this.tableName, { operation: Operation.CREATE, payload }),
      ),
    )
    await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
    return Ok({ id: events[0].aggregateId })
  }
}
