import type { DomainEvent } from '@domain/DomainEvent.js'
import type { StreamKey } from '@utils/streamKey/index.js'

export interface EventStore {
  load: <TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey) => Promise<TEvent[]>
  append: <TEvent extends DomainEvent<TEvent['payload']>>(streamKey: StreamKey, events: TEvent[]) => Promise<void>
}
