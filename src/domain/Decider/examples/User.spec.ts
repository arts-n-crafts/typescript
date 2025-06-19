import type { UserEvent } from './User.ts'
import { randomUUID } from 'node:crypto'
import { beforeEach } from 'vitest'
import { CreateUser } from '../../../infrastructure/CommandBus/examples/CreateUser.ts'
import { UpdateUserName } from '../../../infrastructure/CommandBus/examples/UpdateUserName.ts'
import { UserActivated } from '../../DomainEvent/examples/UserActivated.ts'
import { UserCreated } from '../../DomainEvent/examples/UserCreated.ts'
import { UserNameUpdated } from '../../DomainEvent/examples/UserNameUpdated.ts'
import { User } from './User.ts'

describe('user decider', () => {
  let pastEvents: UserEvent[]
  const createCommand = CreateUser(randomUUID(), { name: 'Elon', email: 'elon@x.com' })
  const updateUserName = UpdateUserName(createCommand.aggregateId, { name: 'Donald' })
  const userCreated = UserCreated(createCommand.aggregateId, createCommand.payload)
  const userNameUpdated = UserNameUpdated(createCommand.aggregateId, updateUserName.payload)

  beforeEach(() => {
    pastEvents = []
  })

  it('should be defined', () => {
    expect(User).toBeDefined()
  })

  describe('user: create user', () => {
    it('should create the user', () => {
      pastEvents = []
      const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

      const decide = User.decide(createCommand, currentState)
      const event = decide.at(0)

      expect(decide).toHaveLength(1)
      expect(event).toStrictEqual({
        ...userCreated,
        id: expect.any(String),
        metadata: {
          timestamp: expect.any(String),
        },
      })
    })

    it('should not create the user if invalid initial state', () => {
      pastEvents = []
      const dirtyState = { id: 'abc-123', name: 'NotInitial', email: 'AlsoNotInitial', prospect: false }
      const currentState = pastEvents.reduce(User.evolve, dirtyState)

      expect(() => User.decide(createCommand, currentState)).toThrow('Invalid User state: expected initial state during creation.')
    })
  })

  describe('user: update name', () => {
    it('should update the name of the user', () => {
      pastEvents = [userCreated]
      const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

      const decide = User.decide(updateUserName, currentState)
      const event = decide.at(0)

      expect(decide).toHaveLength(1)
      expect(event).toStrictEqual({
        ...userNameUpdated,
        id: expect.any(String),
        metadata: {
          timestamp: expect.any(String),
        },
      })
    })

    it('should have the updated name as its current name', () => {
      pastEvents = [userCreated, userNameUpdated]

      const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

      expect(currentState).toStrictEqual({
        email: 'elon@x.com',
        id: expect.any(String),
        name: 'Donald',
        prospect: true,
      })
    })

    it('should not decide to trigger a new userNameUpdated event if the name is not changed by the command', () => {
      pastEvents = [userCreated, userNameUpdated]
      const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

      const decide = User.decide(updateUserName, currentState)

      expect(decide).toHaveLength(0)
    })

    it('should not update the name of the user if the user does not exist', () => {
      const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

      const command = updateUserName

      expect(() => User.decide(command, currentState)).toThrow('Invalid User state: expected mutated state during update.')
    })
  })

  describe('user: edge cases', () => {
    it('should stay in userCreated state', () => {
    // @ts-expect-error UserActivated is not part of possible UserEvents. However, we need to cover exhaustive check
      pastEvents = [userCreated, UserActivated(createCommand.aggregateId, {})]

      const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

      expect(currentState).toStrictEqual({
        email: 'elon@x.com',
        id: expect.any(String),
        name: 'Elon',
        prospect: true,
      })
    })
  })
})
