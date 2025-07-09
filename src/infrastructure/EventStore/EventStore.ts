import type { DomainEvent } from '@domain/DomainEvent.js'

export interface EventStore {
  append: <TEvent extends DomainEvent<TEvent['payload']>>(streamId: string, events: TEvent[]) => Promise<void>
  load: <TEvent extends DomainEvent<TEvent['payload']>>(streamId: string) => Promise<TEvent[]>
}
