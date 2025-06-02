import type { DomainEvent } from '../DomainEvent/DomainEvent'
import type { IEntity } from '../Entity/IEntity'

export interface IAggregateRoot extends IEntity {
  uncommittedEvents: DomainEvent[]
  markEventsCommitted: () => void
}
