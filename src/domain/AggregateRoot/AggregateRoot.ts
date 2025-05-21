import type { DomainEvent } from '../DomainEvent/DomainEvent'
import { Entity } from '../Entity/Entity'

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  protected abstract sequenceNumber: number

  private _uncommittedEvents: DomainEvent[] = []

  protected constructor(id: string, initialProps: TProps) {
    super(id, initialProps)
  }

  static create(_id: string, _props: unknown): AggregateRoot<unknown> {
    throw new Error('Method not implemented.')
  }

  static fromEvents(_id: string, _events: DomainEvent[]): AggregateRoot<unknown> {
    throw new Error('Method not implemented.')
  }

  protected abstract apply(event: DomainEvent): void

  protected addToUncommittedEvents(event: DomainEvent): void {
    this._uncommittedEvents.push(event)
  }

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
