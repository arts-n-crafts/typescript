import type { Decision } from '../shapes/Decision.ts'

export interface Decide<TCommand, TState, TEvent, TIntent = never> {
  decide(command: TCommand, currentState: TState): Decision<TEvent, TIntent>
}
