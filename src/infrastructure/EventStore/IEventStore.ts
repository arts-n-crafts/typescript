import type { DomainEvent } from '../../domain'

export interface IEventStore {
  store: (event: DomainEvent) => Promise<void>
  loadEvents: (aggregateId: string) => Promise<DomainEvent[]>
}
