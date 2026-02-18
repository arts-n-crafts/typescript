import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Rejection } from '@domain/Rejection.ts'

export interface Decider<TState, TCommand, TEvent extends DomainEvent> {
  decide(this: void, command: TCommand, currentState: TState): TEvent[] | Rejection
  evolve(this: void, currentState: TState, event: TEvent): TState
  initialState(this: void, id: string): TState
}
