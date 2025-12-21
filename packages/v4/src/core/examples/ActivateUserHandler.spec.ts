import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { createActivateUserCommand } from '@core/examples/ActivateUser.ts'
import { ActivateUserHandler } from '@core/examples/ActivateUserHandler.ts'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { CreateUserHandler } from '@core/examples/CreateUserHandler.ts'
import { User } from '@domain/examples/User.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'

describe('activateUserHandler', () => {
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>
  let repository: Repository<UserEvent, Promise<UserState>>
  let createUserHandler: CreateUserHandler
  let activateUserHandler: ActivateUserHandler
  const createUserCommand = createRegisterUserCommand(randomUUID(), {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  })
  const activateUserCommand = createActivateUserCommand(<string>createUserCommand.aggregateId, {})

  beforeEach(async () => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)
    createUserHandler = new CreateUserHandler(repository)
    await createUserHandler.execute(createUserCommand)
    activateUserHandler = new ActivateUserHandler(repository)

    const events = await eventStore.load('users', <string>createUserCommand.aggregateId)
    const currentState = events.reduce(User.evolve, User.initialState(<string>createUserCommand.aggregateId))
    expect(currentState.prospect).toBe(true)
  })

  it('should be defined', () => {
    expect(ActivateUserHandler).toBeDefined()
  })

  it('should activate the user', async () => {
    await activateUserHandler.execute(activateUserCommand)
    const events = await eventStore.load('users', <string>createUserCommand.aggregateId)
    const currentState = events.reduce(User.evolve, User.initialState(<string>createUserCommand.aggregateId))
    expect(events).toHaveLength(2)
    expect(currentState.prospect).toBe(false)
  })
})
