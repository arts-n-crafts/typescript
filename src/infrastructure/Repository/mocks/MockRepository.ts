import type { IAggregateRoot } from "../../../domain/AggregateRoot/AggregateRoot";
import { Repository } from "../Repository";

export class MockRepository extends Repository {
  load(_aggregateId: string): Promise<IAggregateRoot> {
    throw new Error("Method not implemented.");
  }

  async store(aggregate: IAggregateRoot): Promise<void> {
    aggregate.uncommittedEvents.forEach(event => {
      this.eventStore.store(event);
    });
    aggregate.markEventsCommitted();
  }
}
