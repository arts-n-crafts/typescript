import type { IAggregateRoot } from "../../../domain/AggregateRoot/AggregateRoot";
import { MockUser } from "../../../domain/AggregateRoot/mocks/MockUser";
import { Repository } from "../Repository";

export class MockRepository extends Repository {
  async load(_aggregateId: string): Promise<IAggregateRoot> {
    return MockUser.create({ name: 'elon', email: '' }, '123');
  }

  async store(aggregate: IAggregateRoot): Promise<void> {
    aggregate.uncommittedEvents.forEach(event => {
      this.eventStore.store(event);
    });
    aggregate.markEventsCommitted();
  }
}
