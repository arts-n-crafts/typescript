import type { IAggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { Specification } from "../../domain/Specification/Specification";

export interface IRepository {
  find(specification: Specification): Promise<unknown>;
  load(aggregateId: string): Promise<IAggregateRoot>;
  store(aggregate: IAggregateRoot): Promise<void>;
}

export abstract class Repository implements IRepository {
  find(_specification: Specification): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  load(_aggregateId: string): Promise<IAggregateRoot> {
    throw new Error("Method not implemented.");
  }
  store(_aggregate: IAggregateRoot): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
