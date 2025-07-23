import type { DomainEvent } from '@domain/DomainEvent.ts'

export interface Repository<TState, TEvent extends DomainEvent> {
  readonly streamName: string
  load: <TResult = TState>(aggregateId: string) => Promise<TResult>
  store: <TResult>(events: TEvent[]) => Promise<TResult>
}
