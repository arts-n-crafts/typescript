import type { IAggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { EventStore } from "../EventStore/EventStore";

interface IRepository<TAggregate extends IAggregateRoot<TAggregate['props']>> {
  load(aggregateId: string): Promise<IAggregateRoot<TAggregate['props']>>;
  store(aggregate: IAggregateRoot<TAggregate['props']>): Promise<void>;
}

export abstract class Repository<TAggregate extends IAggregateRoot<TAggregate['props']>>
implements IRepository<TAggregate>
{
  constructor(
    protected readonly eventStore: EventStore
  ) { }

  abstract load(_aggregateId: string): Promise<IAggregateRoot<TAggregate['props']>>
  abstract store(aggregate: IAggregateRoot<TAggregate['props']>): Promise<void>
}
