import type { AggregateRoot } from '../../../domain/AggregateRoot/AggregateRoot'
import { User } from '../../../domain/AggregateRoot/examples/User'
import { Repository } from '../Repository'

export class UserRepository extends Repository<User> {
  async load(aggregateId: string): Promise<AggregateRoot<User['props']>> {
    const events = await this.eventStore.loadEvents(aggregateId)
    const aggregate = User.rehydrate(aggregateId, events)
    return aggregate
  }

  async store(aggregate: AggregateRoot<User['props']>): Promise<void> {
    await Promise.all(aggregate.uncommittedEvents.map(async event => this.eventStore.store(event)))
    aggregate.markEventsCommitted()
  }
}
