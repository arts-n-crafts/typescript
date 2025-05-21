import type { DomainEvent } from '../DomainEvent/DomainEvent'
import { Entity } from '../Entity/Entity'

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  protected abstract sequenceNumber: number

  private _uncommittedEvents: DomainEvent[] = []

  static create(_id: string, _props: unknown): AggregateRoot<unknown> {
    throw new Error('Method not implemented.')
  }

  static rehydrate(_id: string, _events: DomainEvent[]): AggregateRoot<unknown> {
    throw new Error('Method not implemented.')
  }

  apply(event: DomainEvent): void {
    this._uncommittedEvents.push(event)
    this.applyEvent(event)
  };

  protected abstract applyEvent(event: DomainEvent): void

  get uncommittedEvents(): DomainEvent[] {
    return this._uncommittedEvents
  }

  markEventsCommitted(): void {
    this._uncommittedEvents = []
  }

  protected get nextSequenceNumber(): number {
    return this.sequenceNumber + 1
  }
}
