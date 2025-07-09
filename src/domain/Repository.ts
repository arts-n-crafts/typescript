import type { DomainEvent } from '@domain/DomainEvent.js'

export interface Repository<TEvent extends DomainEvent<unknown>> {
  load: (aggregateId: string) => Promise<TEvent[]>
  store: (events: TEvent[]) => Promise<void>
}
