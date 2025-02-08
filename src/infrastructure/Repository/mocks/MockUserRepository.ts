import { AggregateRoot } from "../../../domain/AggregateRoot/AggregateRoot";
import { MockUser } from "../../../domain/AggregateRoot/mocks/MockUser";
import { Repository } from "../Repository";

export class MockUserRepository extends Repository<MockUser> {
  async load(aggregateId: string): Promise<AggregateRoot<MockUser['props']>> {
    const events = await this.eventStore.loadEvents(aggregateId);
    const aggregate = MockUser.rehydrate(aggregateId, events);
    return aggregate
  }

  async store(aggregate: AggregateRoot<MockUser['props']>): Promise<void> {
    aggregate.uncommittedEvents.forEach(event => {
      this.eventStore.store(event);
    });
    aggregate.markEventsCommitted();
  }
}
