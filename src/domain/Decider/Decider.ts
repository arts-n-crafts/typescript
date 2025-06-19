export interface Decider<State, Command, Event> {
  decide: (command: Command, currentState: State) => Event[]
  evolve: (currentState: State, event: Event) => State
  initialState: (id: string) => State
}
