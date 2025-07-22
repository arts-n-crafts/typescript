import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Database, DatabaseRecord } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { StreamKey } from '@utils/streamKey/StreamKey.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { createStoredEvent } from '../utils/createStoredEvent.ts'

export interface GenericEventStoreConfig {
  tableName?: string | 'event_store'
  outbox?: Outbox
}

export class GenericEventStore implements EventStore {
  private readonly tableName: Required<GenericEventStoreConfig>['tableName']
  private readonly outbox?: GenericEventStoreConfig['outbox']

  constructor(
    private readonly db: Database,
    config: GenericEventStoreConfig = {},
  ) {
    this.tableName = config.tableName ?? 'event_store'
    this.outbox = config.outbox
  }

  async load<TEvent extends DomainEvent = DomainEvent, TReturn = TEvent[]>(streamKey: StreamKey): Promise<TReturn> {
    const specification = new FieldEquals('streamKey', streamKey)
    const storedEvents = await this.db.query<StoredEvent<TEvent>>(this.tableName, specification)
    return storedEvents
      .map(storedEvent => storedEvent.event) as TReturn
  }

  async append<TResult = void>(streamKey: StreamKey, events: DomainEvent[]): Promise<TResult> {
    const currentStream = await this.load(streamKey)
    const eventsToStore = events.map(event => createStoredEvent(streamKey, currentStream.length + 1, event) as unknown as DatabaseRecord)
    await Promise.all(
      eventsToStore.map(async payload => this.db.execute(this.tableName, { operation: Operation.CREATE, payload }),
      ),
    )
    await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
    return undefined as TResult
  }
}
