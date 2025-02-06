import type { IAggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { EventStore } from "../EventStore/EventStore";

interface IRepository {
  load(aggregateId: string): Promise<IAggregateRoot>;
  store(aggregate: IAggregateRoot): Promise<void>;
}

export abstract class Repository implements IRepository {
  constructor(
    protected readonly eventStore: EventStore
  ) { }

  abstract load(_aggregateId: string): Promise<IAggregateRoot>
  abstract store(aggregate: IAggregateRoot): Promise<void>
}
