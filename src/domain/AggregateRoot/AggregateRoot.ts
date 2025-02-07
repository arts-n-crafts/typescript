import type { IDomainEvent } from "../DomainEvent/DomainEvent";
import { Entity } from "../Entity/Entity";

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
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
