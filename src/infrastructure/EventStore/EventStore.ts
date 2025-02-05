import type { IDomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface EventStore {
  store(event: IDomainEvent): Promise<void>;
  loadEvents(aggregateId: string): Promise<IDomainEvent[]>;
}
 