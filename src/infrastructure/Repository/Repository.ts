import type { IAggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { EventStore } from "../EventStore/EventStore";

export abstract class Repository<TAggregate extends IAggregateRoot<TAggregate['props']>>
{
  constructor(
    protected readonly eventStore: EventStore
  ) { }

  abstract load(_aggregateId: string): Promise<IAggregateRoot<TAggregate['props']>>
  abstract store(aggregate: IAggregateRoot<TAggregate['props']>): Promise<void>
}
