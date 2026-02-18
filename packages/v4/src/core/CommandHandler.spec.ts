import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { createUpdateNameOfUserCommand } from '@core/examples/UpdateUserName.ts'
import { User } from '@domain/examples/User.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { CreateUserHandler } from './examples/CreateUserHandler.ts'
import { UpdateUserNameHandler } from './examples/UpdateUserNameHandler.ts'

describe('commandHandler', async () => {
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>
  let repository: Repository<UserEvent, Promise<UserState>>
  let createUserHandler: CreateUserHandler
  let outbox: InMemoryOutbox
  const command = createRegisterUserCommand(randomUUID(), {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  })

  beforeEach(async () => {
    database = new SimpleDatabase()
    outbox = new InMemoryOutbox()
    eventStore = new SimpleEventStore(database, outbox)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)
    createUserHandler = new CreateUserHandler(repository, outbox)
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(UpdateUserNameHandler).toBeDefined()
  })

  it('should process the MockCreateUser Command and emit the MockUserCreated Event', async () => {
    const events = await eventStore.load('users', <string>command.aggregateId)
    const event = events.at(0)
    expect(events).toHaveLength(1)
    expect(event?.type).toBe('UserCreated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(command.aggregateId)
  })

  it('should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event', async () => {
    const updateUserNameHandler = new UpdateUserNameHandler(repository, outbox)
    const updateUserNameCommand = createUpdateNameOfUserCommand(<string>command.aggregateId, { name: 'test' })
    await updateUserNameHandler.execute(updateUserNameCommand)
    const events = await eventStore.load('users', <string>command.aggregateId)
    const event = events.at(1)
    expect(events).toHaveLength(2)
    expect(event?.type).toBe('UserNameUpdated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(command.aggregateId)
  })
})
