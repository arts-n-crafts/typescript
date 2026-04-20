import type { DomainEvent } from '../shapes/DomainEvent.ts'

export interface AppendsDomainEvents<TDomainEvent extends DomainEvent, TReturn = Promise<void>> {
  append(aggregateId: string, domainEvents: TDomainEvent[]): TReturn
}
