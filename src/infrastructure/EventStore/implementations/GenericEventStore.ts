import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.js'
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
    private readonly db: InMemoryDatabase,
    config: GenericEventStoreConfig = {},
  ) {
    this.tableName = config.tableName ?? 'event_store'
    this.outbox = config.outbox
  }

  async load<TReturnType>(streamKey: StreamKey): Promise<TReturnType> {
    const specification = new FieldEquals('streamKey', streamKey)
    const storedEvents = await this.db.query<StoredEvent<DomainEvent>[]>(this.tableName, specification)

    return storedEvents.map(storedEvent => storedEvent.event) as unknown as TReturnType
  }

  async append<TEvent extends DomainEvent>(streamKey: StreamKey, events: TEvent[]): Promise<void> {
    const currentStream = await this.load<TEvent[]>(streamKey)
    const eventsToStore = events
      .map(event => createStoredEvent(streamKey, currentStream.length + 1, event))
    await Promise.all(
      eventsToStore.map(async payload => this.db.execute(this.tableName, { operation: Operation.CREATE, payload }),
      ),
    )
    await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
  }
}
