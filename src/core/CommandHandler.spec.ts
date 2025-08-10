import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { SimpleDatabaseResult } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { SimpleEventStoreResult } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { SimpleRepositoryResult } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { createUpdateNameOfUserCommand } from '@core/examples/UpdateUserName.ts'
import { User } from '@domain/examples/User.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { makeStreamKey } from '@utils/streamKey/index.ts'
import { CreateUserHandler } from './examples/CreateUserHandler.ts'
import { UpdateUserNameHandler } from './examples/UpdateUserNameHandler.ts'

describe('commandHandler', async () => {
  let database: Database<StoredEvent<UserEvent>, SimpleDatabaseResult>
  let eventStore: EventStore<UserEvent, SimpleEventStoreResult>
  let repository: Repository<UserEvent, SimpleRepositoryResult, UserState>
  let createUserHandler: CreateUserHandler
  const command = createRegisterUserCommand(randomUUID(), {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  })
  const streamKey = makeStreamKey('users', command.aggregateId)

  beforeEach(async () => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)
    createUserHandler = new CreateUserHandler(repository)
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(UpdateUserNameHandler).toBeDefined()
  })

  it('should process the MockCreateUser Command and emit the MockUserCreated Event', async () => {
    const events = await eventStore.load(streamKey)
    const event = events.at(0)
    expect(events).toHaveLength(1)
    expect(event?.type).toBe('UserCreated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(command.aggregateId)
  })

  it('should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event', async () => {
    const updateUserNameHandler = new UpdateUserNameHandler(repository)
    const updateUserNameCommand = createUpdateNameOfUserCommand(command.aggregateId, { name: 'test' })
    await updateUserNameHandler.execute(updateUserNameCommand)
    const events = await eventStore.load(streamKey)
    const event = events.at(1)
    expect(events).toHaveLength(2)
    expect(event?.type).toBe('UserNameUpdated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(command.aggregateId)
  })
})
