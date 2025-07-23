import type { DomainEvent } from '@domain/DomainEvent.ts'

export interface Decider<TState, TCommand, TEvent extends DomainEvent<TEvent['payload']>> {
  decide(this: void, command: TCommand, currentState: TState): TEvent[]
  evolve(this: void, currentState: TState, event: TEvent): TState
  initialState(this: void, id: string): TState
}
