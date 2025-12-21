import type { DomainEvent } from '@domain/DomainEvent.ts'

interface Identifiable<TId> {
  id: TId
}

interface HasProperties<TProps extends object> {
  props: TProps
}

interface hasOutbox<TEvent extends DomainEvent> {
  uncommittedEvents: TEvent[]
}

interface EventBased<TEvent extends DomainEvent> {
  fromEvents(events: TEvent[]): void
}

export interface AggregateRoot<TId, TProps extends object, TEvent extends DomainEvent>
  extends
  Identifiable<TId>,
  HasProperties<TProps>,
  hasOutbox<TEvent>
{
  get id(): TId
  get props(): TProps
  get uncommittedEvents(): TEvent[]
}

export interface EventBasedAggregateRoot<TId, TProps extends object, TEvent extends DomainEvent>
  extends AggregateRoot<TId, TProps, TEvent>, EventBased<TEvent> {}
