import type { UserEvent } from '@domain/examples/User.ts'
import { randomUUID } from 'node:crypto'
import { createActivateUserCommand } from '@core/examples/ActivateUser.ts'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { createUpdateNameOfUserCommand } from '@core/examples/UpdateUserName.ts'
import { User } from '@domain/examples/User.ts'
import { createUserActivatedEvent } from '@domain/examples/UserActivated.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { isRejection } from '@domain/utils/isRejection.ts'
import { beforeEach } from 'vitest'

describe('user decider', () => {
  let pastEvents: UserEvent[]
  const createCommand = createRegisterUserCommand(randomUUID(), { name: 'Elon', email: 'elon@x.com' })
  const updateUserName = createUpdateNameOfUserCommand(<string>createCommand.aggregateId, { name: 'Donald' })
  const userCreated = createUserCreatedEvent(<string>createCommand.aggregateId, createCommand.payload)
  const userNameUpdated = createUserNameUpdatedEvent(<string>createCommand.aggregateId, updateUserName.payload)
  const activateUser = createActivateUserCommand(<string>createCommand.aggregateId, {})

  beforeEach(() => {
    pastEvents = []
  })

  it('should be defined', () => {
    expect(User).toBeDefined()
  })

  describe('user: create user', () => {
    it('should create the user', () => {
      pastEvents = []
      const currentState = pastEvents.reduce(User.evolve, User.initialState(<string>createCommand.aggregateId))

      const decide = User.decide(createCommand, currentState)
      expect(Array.isArray(decide)).toBe(true)
      const events = decide as UserEvent[]
      const event = events.at(0)

      expect(events).toHaveLength(1)
      expect(event).toStrictEqual({
        ...userCreated,
        // eslint-disable-next-line ts/no-unsafe-assignment
        id: expect.any(String),
        // eslint-disable-next-line ts/no-unsafe-assignment
        timestamp: expect.any(Number),
        metadata: {},
      })
    })

    it('should not create the user if not initial state (already registered)', () => {
      pastEvents = []
      const dirtyState = { id: 'abc-123', name: 'NotInitial', email: 'AlsoNotInitial', prospect: false }
      const currentState = pastEvents.reduce(User.evolve, dirtyState)
      const decision = User.decide(createCommand, currentState)
      expect(decision).toMatchObject({ reasonCode: 'ALREADY_EXISTS', commandType: 'CreateUser' })
    })
  })

  describe('user: update name', () => {
    it('should update the name of the user', () => {
      pastEvents = [userCreated]
      const currentState = pastEvents.reduce(User.evolve, User.initialState(<string>createCommand.aggregateId))

      const decide = User.decide(updateUserName, currentState) as UserEvent[]
      const event = decide.at(0)

      expect(decide).toHaveLength(1)
      expect(event).toStrictEqual({
        ...userNameUpdated,
        // eslint-disable-next-line ts/no-unsafe-assignment
        id: expect.any(String),
        // eslint-disable-next-line ts/no-unsafe-assignment
        timestamp: expect.any(Number),
        metadata: {
        },
      })
    })

    it('should have the updated name as its current name', () => {
      pastEvents = [userCreated, userNameUpdated]

      const currentState = pastEvents.reduce(User.evolve, User.initialState(<string>createCommand.aggregateId))

      expect(currentState).toStrictEqual({
        email: 'elon@x.com',
        // eslint-disable-next-line ts/no-unsafe-assignment
        id: expect.any(String),
        name: 'Donald',
        prospect: true,
      })
    })

    it('should not decide to trigger a new userNameUpdated event if the name is not changed by the command', () => {
      pastEvents = [userCreated, userNameUpdated]
      const currentState = pastEvents.reduce(User.evolve, User.initialState(<string>createCommand.aggregateId))

      const decide = User.decide(updateUserName, currentState)

      expect(decide).toHaveLength(0)
    })

    it('should not update the name of the user if the user does not exist', () => {
      const currentState = pastEvents.reduce(User.evolve, User.initialState(<string>createCommand.aggregateId))

      const command = updateUserName

      expect(() => User.decide(command, currentState)).toThrow('Invalid User state: expected mutated state during update.')
    })
  })

  describe('user: activate user', () => {
    it('should decide to activate the user', () => {
      pastEvents = [userCreated]

      const currentState = pastEvents.reduce(User.evolve, User.initialState(<string>createCommand.aggregateId))

      const decision = User.decide(activateUser, currentState)
      expect(decision).toHaveLength(1)
      expect(decision).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          aggregateType: 'User',
          kind: 'domain',
          type: 'UserActivated',
          payload: activateUser.payload,
        }),
      ]))
    })

    it('should decide that nothing should happen', () => {
      pastEvents = [userCreated, createUserActivatedEvent(<string>createCommand.aggregateId, {})]

      const currentState = pastEvents.reduce(User.evolve, User.initialState(<string>createCommand.aggregateId))
      const decide = User.decide(activateUser, currentState)

      expect(decide).toHaveLength(0)
    })
  })
})
