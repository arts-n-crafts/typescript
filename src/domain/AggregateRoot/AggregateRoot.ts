import type { DomainEvent } from '../DomainEvent/DomainEvent'
import { Entity } from '../Entity/Entity'

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private _uncommittedEvents: DomainEvent<unknown>[] = []

  static create(_id: string, _props: unknown): AggregateRoot<unknown> {
    throw new Error('Method not implemented.')
  }

  static rehydrate(_id: string, _events: DomainEvent<unknown>[]): AggregateRoot<unknown> {
    throw new Error('Method not implemented.')
  }

  apply(event: DomainEvent<unknown>): void {
    this._uncommittedEvents.push(event)
    this._applyEvent(event)
  };

  protected abstract _applyEvent(event: DomainEvent<unknown>): void

  get uncommittedEvents(): DomainEvent<unknown>[] {
    return this._uncommittedEvents
  }

  markEventsCommitted(): void {
    this._uncommittedEvents = []
  }
}
