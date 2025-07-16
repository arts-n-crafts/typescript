import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Database, DatabaseRecord } from '@infrastructure/Database/Database.ts'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { StreamKey } from '@utils/streamKey/StreamKey.ts'
import type { StoredEvent } from './StoredEvent.ts'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { createStoredEvent } from './utils/createStoredEvent.ts'

export class EventStore {
  private readonly tableName = 'event_store'

  constructor(
    private readonly db: Database,
    private readonly outbox?: Outbox,
  ) {}

  async load<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey): Promise<TEvent[]> {
    const specification = new FieldEquals('streamKey', streamKey)
    const storedEvents = await this.db.query<StoredEvent<TEvent>>(this.tableName, specification)
    return storedEvents
      .map(storedEvent => storedEvent.event)
  }

  async append<TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey, events: TEvent[]): Promise<void> {
    const currentStream = await this.load(streamKey)
    const eventsToStore = events.map(event => createStoredEvent(streamKey, currentStream.length + 1, event) as unknown as DatabaseRecord)
    await Promise.all(
      eventsToStore.map(async payload => this.db.execute(this.tableName, { operation: Operation.CREATE, payload }),
      ),
    )
    await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
  }
}
