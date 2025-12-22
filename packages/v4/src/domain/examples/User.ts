import type { ActivateUserCommand } from '@core/examples/ActivateUser.ts'
import type { RegisterUserCommand } from '@core/examples/CreateUser.ts'
import type { UpdateUserNameCommand } from '@core/examples/UpdateUserName.ts'
import type { UserAlreadyExistsRejection } from '@core/examples/UserAlreadyExists.ts'
import type { Decider } from '@domain/Decider.ts'
import type { UserActivatedEvent } from '@domain/examples/UserActivated.ts'
import type { UserCreatedEvent } from '@domain/examples/UserCreated.ts'
import type { UserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import type { UserRegistrationEmailSentEvent } from '@domain/examples/UserRegistrationEmailSent.ts'
import { createUserAlreadyExistsRejection } from '@core/examples/UserAlreadyExists.ts'
import { createUserActivatedEvent } from '@domain/examples/UserActivated.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { fail } from '@utils/fail/fail.ts'
import { invariant } from '@utils/invariant/invariant.ts'

export type UserEvent = UserCreatedEvent | UserNameUpdatedEvent | UserRegistrationEmailSentEvent | UserActivatedEvent
export type UserRejection = UserAlreadyExistsRejection
export type UserCommand = RegisterUserCommand | UpdateUserNameCommand | ActivateUserCommand

class UnexpectedUserState extends Error {
  constructor(msg: string) {
    super(`Invalid User state: ${msg}.`)
  }
}

export interface UserState {
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

function isInitialState(this: void, state: UserState): boolean {
  return state.name === '' && state.email === '' && state.prospect
}

function evolveUserState(this: void, currentState: UserState, event: UserEvent): UserState {
  switch (event.type) {
    case 'UserCreated':
      return { ...currentState, ...(event as ReturnType<typeof createUserCreatedEvent>).payload }
    case 'UserNameUpdated':
      return { ...currentState, name: (event as ReturnType<typeof createUserNameUpdatedEvent>).payload.name }
    case 'UserActivated':
      return { ...currentState, prospect: false }
    default:
      return currentState
  }
}

function decideUserState(this: void, command: UserCommand, currentState: UserState): (UserEvent | UserRejection)[] {
  switch (command.type) {
    case 'CreateUser': {
      if (!isInitialState(currentState)) {
        return [createUserAlreadyExistsRejection(command)]
      }
      return [createUserCreatedEvent(<string>command.aggregateId, command.payload, command.metadata)]
    }
    case 'UpdateUserName': {
      invariant(!isInitialState(currentState), fail(new UnexpectedUserState('expected mutated state during update')))
      if (currentState.name === command.payload.name) {
        return []
      }
      return [createUserNameUpdatedEvent(<string>command.aggregateId, command.payload, command.metadata)]
    }
    case 'ActivateUser': {
      invariant(!isInitialState(currentState), fail(new UnexpectedUserState('expected mutated state during update')))
      if (!currentState.prospect) {
        return []
      }
      return [createUserActivatedEvent(<string>command.aggregateId, command.payload, command.metadata)]
    }
  }
}

export const User: Decider<UserState, UserCommand, UserEvent, UserRejection> = {
  initialState: initialUserState,
  evolve: evolveUserState,
  decide: decideUserState,
}
