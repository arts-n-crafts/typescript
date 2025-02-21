import type { AggregateRoot } from '../../domain/AggregateRoot/AggregateRoot'
import type { EventStore } from '../EventStore/EventStore'

export abstract class Repository<TAggregate extends AggregateRoot<TAggregate['props']>> {
  constructor(
    protected readonly eventStore: EventStore,
  ) { }

  abstract load(_aggregateId: string): Promise<AggregateRoot<TAggregate['props']>>
  abstract store(aggregate: AggregateRoot<TAggregate['props']>): Promise<void>
}
