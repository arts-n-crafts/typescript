import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StreamKey } from '@utils/streamKey/index.ts'

export interface EventStore {
  load: <TReturn>(streamKey: StreamKey) => Promise<TReturn>
  append: <TEvent extends DomainEvent, TReturn>(streamKey: StreamKey, events: TEvent[]) => Promise<TReturn>
}
