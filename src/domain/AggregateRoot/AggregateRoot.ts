import type { IDomainEvent } from "../DomainEvent/DomainEvent";
import type { IEntity } from "../Entity/Entity";

export interface IAggregateRoot extends IEntity {
  apply(event: IDomainEvent): void;
  getUncommittedEvents(): IDomainEvent[];
  markEventsCommitted(): void;
}
