import type { DomainEvent } from '@domain/DomainEvent.js'
import type { OutboxEntry } from '@infrastructure/EventStore/OutboxEntry.js'

export interface EventStore {
  append: <TEvent extends DomainEvent<TEvent['payload']>>(streamId: string, events: TEvent[]) => Promise<void>
  load: <TEvent extends DomainEvent<TEvent['payload']>>(streamId: string) => Promise<TEvent[]>
  getOutboxBatch: (limit?: number) => OutboxEntry[]
  acknowledgeDispatch: (id: string) => void
}
