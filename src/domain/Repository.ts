import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { EventStoreResult } from '@infrastructure/EventStore/EventStore.ts'

export interface Repository<TState, TEvent extends DomainEvent> {
  readonly streamName: string

  load(aggregateId: string): Promise<TState>
  load<TReturnType>(aggregateId: string): Promise<TReturnType>

  store(events: TEvent[]): Promise<EventStoreResult>
  store<TReturnType>(events: TEvent[]): Promise<TReturnType>
}
