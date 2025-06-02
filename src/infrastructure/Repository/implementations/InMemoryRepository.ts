import type { DomainEvent } from '../../../domain'
import type { IAggregateRoot } from '../../../domain/AggregateRoot/IAggregateRoot'
import type { IAggregateRootFactory } from '../../../domain/AggregateRoot/IAggregateRootFactory'
import type { IRepository } from '../../../domain/Repository/IRepository'
import type { IEventStore } from '../../EventStore/IEventStore'

export class InMemoryRepository<TAggregate extends IAggregateRoot, TProps extends object> implements IRepository<TAggregate> {
  constructor(
    protected readonly eventStore: IEventStore,
    protected readonly aggregateRootFactory: IAggregateRootFactory<TAggregate, TProps>,
  ) { }

  async load(aggregateId: string): Promise<TAggregate> {
    const events = await this.eventStore.loadEvents(aggregateId)
    return this.aggregateRootFactory.fromEvents(aggregateId, events)
  }

  async store(aggregate: IAggregateRoot): Promise<void> {
    await Promise.all(
      aggregate.uncommittedEvents.map(
        async (event: DomainEvent) => this.eventStore.store(event),
      ),
    )
    aggregate.markEventsCommitted()
  }
}
