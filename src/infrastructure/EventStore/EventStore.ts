import type { DomainEvent } from '@domain/DomainEvent.js'
import type { StreamKey } from '@utils/streamKey/index.js'

export interface EventStore {
  load: <TEvent extends DomainEvent = DomainEvent, TReturn = TEvent[]>(streamKey: StreamKey) => Promise<TReturn>
  append: <TResult = void>(streamKey: StreamKey, events: DomainEvent<unknown>[]) => Promise<TResult>
}
