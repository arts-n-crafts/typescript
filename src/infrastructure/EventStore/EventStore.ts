import type { DomainEvent } from '@domain/DomainEvent.js'
import type { OutboxEntry } from '@infrastructure/EventStore/OutboxEntry.js'
import type { StreamKey } from '@utils/streamKey/index.js'

export interface EventStore<TEvent extends DomainEvent<TEvent['payload']>> {
  append: (streamKey: StreamKey, events: TEvent[]) => Promise<void>
  load: (streamKey: StreamKey) => Promise<TEvent[]>
  getOutboxBatch: (limit?: number) => OutboxEntry[]
  acknowledgeDispatch: (id: string) => void
}
