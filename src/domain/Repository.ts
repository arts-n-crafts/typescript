import type { DomainEvent } from '@domain/DomainEvent.js'

export interface Repository {
  load: (aggregateId: string) => Promise<unknown>
  store: <TEvent extends DomainEvent<TEvent['payload']>>(events: TEvent[]) => Promise<void>
}
