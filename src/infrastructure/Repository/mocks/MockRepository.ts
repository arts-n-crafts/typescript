import type { IAggregateRoot } from "../../../domain/AggregateRoot/AggregateRoot";
import { MockUser } from "../../../domain/AggregateRoot/mocks/MockUser";
import { Repository } from "../Repository";

export class MockRepository extends Repository {
  async load(aggregateId: string): Promise<IAggregateRoot> {
    const events = await this.eventStore.loadEvents(aggregateId);
    const aggregate = MockUser.rehydrate(aggregateId, events);
    return aggregate
  }

  async store(aggregate: IAggregateRoot): Promise<void> {
    aggregate.uncommittedEvents.forEach(event => {
      this.eventStore.store(event);
    });
    aggregate.markEventsCommitted();
  }
}
