import type { CreateUser } from '../../../infrastructure/CommandBus/examples/CreateUser.ts'
import type { UpdateUserName } from '../../../infrastructure/CommandBus/examples/UpdateUserName.ts'
import type { Decider } from '../Decider.ts'
import { fail, invariant } from '../../../utils'
import { UserCreated } from '../../DomainEvent/examples/UserCreated.ts'
import { UserNameUpdated } from '../../DomainEvent/examples/UserNameUpdated.ts'

export type UserEvent = ReturnType<typeof UserCreated> | ReturnType<typeof UserNameUpdated>
export type UserCommand = ReturnType<typeof CreateUser> | ReturnType<typeof UpdateUserName>

class UnexpectedUserState extends Error {
  constructor(msg: string) {
    super(`Invalid User state: ${msg}.`)
  }
}

interface UserState {
  id: string
  name: string
  email: string
  age?: number
  prospect: boolean
}

function initialUserState(id: string): UserState {
  return {
    id,
    name: '',
    email: '',
    prospect: true,
  }
}

function isInitialState(state: UserState): boolean {
  return state.name === '' && state.email === '' && state.prospect
}

function evolveUserState(currentState: UserState, event: UserEvent): UserState {
  switch (event.type) {
    case 'UserCreated':
      return { ...currentState, ...event.payload }
    case 'UserNameUpdated':
      return { ...currentState, name: event.payload.name }
    default:
      return currentState
  }
}

function decideUserState(command: UserCommand, currentState: UserState): UserEvent[] | never {
  switch (command.type) {
    case 'CreateUser': {
      invariant(isInitialState(currentState), fail(new UnexpectedUserState('expected initial state during creation')))
      return [UserCreated(command.aggregateId, command.payload, command.metadata)]
    }
    case 'UpdateUserName': {
      invariant(!isInitialState(currentState), fail(new UnexpectedUserState('expected mutated state during update')))
      if (currentState.name === command.payload.name) {
        return []
      }
      return [UserNameUpdated(command.aggregateId, command.payload, command.metadata)]
    }
  }
}

export const User: Decider<UserState, UserCommand, UserEvent> = {
  initialState: initialUserState,
  evolve: evolveUserState,
  decide: decideUserState,
}
