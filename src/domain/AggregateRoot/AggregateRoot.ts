import type { IDomainEvent } from "../DomainEvent/DomainEvent";
import { Entity, type IEntity } from "../Entity/Entity";

export interface IAggregateRoot extends IEntity {
  apply(event: IDomainEvent): void;
  getUncommittedEvents(): IDomainEvent[];
  markEventsCommitted(): void;
}

export abstract class AggregateRoot<AggregateRootProps extends object>
  extends Entity<AggregateRootProps>
  implements IAggregateRoot
{
  apply(_event: IDomainEvent): void {
    throw new Error("Method not implemented.");
  }
  getUncommittedEvents(): IDomainEvent[] {
    throw new Error("Method not implemented.");
  }
  markEventsCommitted(): void {
    throw new Error("Method not implemented.");
  }

}
