import type { DomainEvent } from '@domain/DomainEvent.js'

export interface Decider<TState, TCommand, TEvent extends DomainEvent<TEvent['payload']>> {
  decide: (command: TCommand, currentState: TState) => TEvent[]
  evolve: (currentState: TState, event: TEvent) => TState
  initialState: (id: string) => TState
}
