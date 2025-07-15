import type { DomainEvent } from '@domain/DomainEvent.js'
import type { OutboxEntry } from '@infrastructure/EventStore/OutboxEntry.js'
import type { StreamKey } from '@utils/streamKey/index.js'

export interface EventStore {
  append: <TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey, events: TEvent[]) => Promise<void>
  load: <TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey) => Promise<TEvent[]>
  getOutboxBatch: (limit?: number) => OutboxEntry[]
  acknowledgeDispatch: (id: string) => void
}
