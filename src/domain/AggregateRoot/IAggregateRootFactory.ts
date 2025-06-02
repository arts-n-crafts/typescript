import type { DomainEvent } from '../DomainEvent/DomainEvent'
import type { IAggregateRoot } from './IAggregateRoot'

export interface IAggregateRootFactory<TAggregate extends IAggregateRoot, TProps extends object> {
  create: (id: string, props: TProps) => TAggregate
  fromEvents: (id: string, events: DomainEvent[]) => TAggregate
}
