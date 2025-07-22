import type { DomainEvent } from '@domain/DomainEvent.ts'

export interface Repository<TState, TEvent extends DomainEvent<TEvent['payload']>> {
  readonly streamName: string
  load: <TResult = TState>(aggregateId: string) => Promise<TResult>
  store: <TResult = void>(events: TEvent[]) => Promise<TResult>
}
