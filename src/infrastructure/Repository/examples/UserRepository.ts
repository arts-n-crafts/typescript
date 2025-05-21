import { User } from '../../../domain/AggregateRoot/examples/User'
import { Repository } from '../Repository'

export class UserRepository extends Repository<User> {
  async load(aggregateId: string): Promise<User> {
    const events = await this.eventStore.loadEvents(aggregateId)
    const aggregate = User.fromEvents(aggregateId, events)
    return aggregate
  }

  async store(aggregate: User): Promise<void> {
    await Promise.all(aggregate.uncommittedEvents.map(async event => this.eventStore.store(event)))
    aggregate.markEventsCommitted()
  }
}
