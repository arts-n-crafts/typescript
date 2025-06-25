import type { Decider } from '@domain/Decider.ts'
import type { ActivateUser } from '@domain/examples/ActivateUser.ts'
import type { CreateUser } from '@domain/examples/CreateUser.ts'
import type { UpdateUserName } from '@domain/examples/UpdateUserName.ts'
import type { UserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'
import { UserActivated } from '@domain/examples/UserActivated.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { fail } from '@utils/fail/fail.ts'
import { invariant } from '@utils/invariant/invariant.ts'

export type UserEvent = ReturnType<typeof UserCreated> | ReturnType<typeof UserNameUpdated> | ReturnType<typeof UserRegistrationEmailSent> | ReturnType<typeof UserActivated>
export type UserCommand = ReturnType<typeof CreateUser> | ReturnType<typeof UpdateUserName> | ReturnType<typeof ActivateUser>

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
      return { ...currentState, ...(event as ReturnType<typeof UserCreated>).payload }
    case 'UserNameUpdated':
      return { ...currentState, name: (event as ReturnType<typeof UserNameUpdated>).payload.name }
    case 'UserActivated':
      return { ...currentState, prospect: false }
    default:
      return currentState
  }
}

function decideUserState(command: UserCommand, currentState: UserState): UserEvent[] {
  switch (command.type) {
    case 'CreateUser': {
      if (!isInitialState(currentState)) {
        return []
      }
      return [UserCreated(command.aggregateId, command.payload, command.metadata)]
    }
    case 'UpdateUserName': {
      invariant(!isInitialState(currentState), fail(new UnexpectedUserState('expected mutated state during update')))
      if (currentState.name === command.payload.name) {
        return []
      }
      return [UserNameUpdated(command.aggregateId, command.payload, command.metadata)]
    }
    case 'ActivateUser': {
      invariant(!isInitialState(currentState), fail(new UnexpectedUserState('expected mutated state during update')))
      if (!currentState.prospect) {
        return []
      }
      return [UserActivated(command.aggregateId, command.payload, command.metadata)]
    }
  }
}

export const User: Decider<UserState, UserCommand, UserEvent> = {
  initialState: initialUserState,
  evolve: evolveUserState,
  decide: decideUserState,
}
