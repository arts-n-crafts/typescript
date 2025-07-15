import type { DomainEvent } from '@domain/DomainEvent.js'

export interface Repository<TState, TEvent extends DomainEvent<TEvent['payload']>> {
  readonly streamName: string
  load: (aggregateId: string) => Promise<TState>
  store: (events: TEvent[]) => Promise<void>
}
