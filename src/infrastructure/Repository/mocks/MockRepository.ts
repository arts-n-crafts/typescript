import type { IAggregateRoot } from "../../../domain/AggregateRoot/AggregateRoot";
import { Repository } from "../Repository";

export class MockRepository extends Repository {
  load(_aggregateId: string): Promise<IAggregateRoot> {
    throw new Error("Method not implemented.");
  }
  store(_aggregate: IAggregateRoot): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
