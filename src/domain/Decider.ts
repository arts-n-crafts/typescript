export interface Decider<TState, TCommand, TEvent> {
  decide: (command: TCommand, currentState: TState) => TEvent[]
  evolve: (currentState: TState, event: TEvent) => TState
  initialState: (id: string) => TState
}
