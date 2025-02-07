import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface EventStore {
  store(event: DomainEvent<unknown>): Promise<void>;
  loadEvents(aggregateId: string): Promise<DomainEvent<unknown>[]>;
}
