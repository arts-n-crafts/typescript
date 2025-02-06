import type { IDomainEvent } from "../DomainEvent/DomainEvent";
import { Entity, type IEntity } from "../Entity/Entity";

export interface IAggregateRoot extends IEntity {
  apply(event: IDomainEvent): void;
  uncommittedEvents: IDomainEvent[];
  markEventsCommitted(): void;
}

export abstract class AggregateRoot<AggregateRootProps extends object>
  extends Entity<AggregateRootProps>
  implements IAggregateRoot
{
  private _uncommittedEvents: IDomainEvent[] = [];

  apply(event: IDomainEvent): void {
    this._uncommittedEvents.push(event);
    this._applyEvent(event);
  };

  protected abstract _applyEvent(event: IDomainEvent): void;

  get uncommittedEvents(): IDomainEvent[] {
    return this._uncommittedEvents;
  }

  markEventsCommitted(): void {
    this._uncommittedEvents = [];
  }
}
