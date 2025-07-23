import type { Try } from '@core/types/Try.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { StreamKey } from '@utils/streamKey/StreamKey.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from '@infrastructure/Database/Database.ts'
import { goTryCatch } from '@utils/goTryCatch/goTryCatch.ts'
import { createStoredEvent } from '../utils/createStoredEvent.ts'

export interface EventStoreTryConfig {
  tableName?: string | 'event_store'
  outbox?: Outbox
}

export class EventStoreTry implements EventStore<Try<void, Error>> {
  private readonly tableName: Required<EventStoreTryConfig>['tableName']
  private readonly outbox?: EventStoreTryConfig['outbox']

  constructor(
    private readonly db: Database,
    config: EventStoreTryConfig = {},
  ) {
    this.tableName = config.tableName ?? 'event_store'
    this.outbox = config.outbox
  }

  async load<TEvent extends DomainEvent>(streamKey: StreamKey): Promise<Try<TEvent[], Error>> {
    const specification = new FieldEquals('streamKey', streamKey)
    const [storedEvents, err] = await goTryCatch(this.db.query<StoredEvent<TEvent>>(this.tableName, specification))
    if (err) {
      return [undefined, new Error('Failed to load stream from the EventStore')]
    }
    return [storedEvents.map(storedEvent => storedEvent.event), undefined]
  }

  async append<TEvent extends DomainEvent>(streamKey: StreamKey, events: TEvent[]): Promise<Try<void, Error>> {
    const [currentStream, loadErr] = await this.load<TEvent>(streamKey)
    if (loadErr) {
      return [undefined, new Error('Failed to load stream from the EventStore')]
    }
    const eventsToStore = events
      .map(event => createStoredEvent(streamKey, currentStream.length + 1, event))
    const dbStoreResult = await goTryCatch(Promise.all(
      eventsToStore.map(async payload => this.db.execute(this.tableName, { operation: Operation.CREATE, payload }),
      ),
    ))
    if (dbStoreResult[1]) {
      return [undefined, new Error('Failed to store events in the EventStore')]
    }
    const outboxEnqueueResult = await goTryCatch(Promise.all(events.map(async event => this.outbox?.enqueue(event))))
    if (outboxEnqueueResult[1]) {
      return [undefined, new Error('Failed to enqueue events in the Outbox')]
    }
    return [undefined, undefined]
  }
}
