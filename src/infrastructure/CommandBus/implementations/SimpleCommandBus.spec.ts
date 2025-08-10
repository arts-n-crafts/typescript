import type { UserCommand, UserEvent, UserState } from '@domain/examples/User.ts'
import type { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { SimpleDatabaseResult } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { SimpleEventStoreResult } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { SimpleRepositoryResult } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { CreateUserHandler } from '@core/examples/CreateUserHandler.ts'
import { createUpdateNameOfUserCommand } from '@core/examples/UpdateUserName.ts'
import { UpdateUserNameHandler } from '@core/examples/UpdateUserNameHandler.ts'
import { User } from '@domain/examples/User.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { makeStreamKey } from '@utils/streamKey/makeStreamKey.ts'
import { SimpleCommandBus } from './SimpleCommandBus.ts'

describe('commandBus', () => {
  const command = createRegisterUserCommand(randomUUID(), { name: 'Elon', email: 'musk@x.com', age: 52 })
  let database: Database<StoredEvent<UserEvent>, SimpleDatabaseResult>
  let eventStore: EventStore<UserEvent, SimpleEventStoreResult>
  let repository: Repository<UserEvent, SimpleRepositoryResult, UserState>
  let commandBus: SimpleCommandBus<UserCommand>
  let handler: UpdateUserNameHandler

  beforeEach(async () => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)

    commandBus = new SimpleCommandBus()
    handler = new UpdateUserNameHandler(repository)
    const createUserHandler = new CreateUserHandler(repository)
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(SimpleCommandBus).toBeDefined()
  })

  it('should register a command handler', () => {
    commandBus.register('UpdateUserName', handler)
  })

  it('should process the command via commandBus and return the event', async () => {
    const streamKey = makeStreamKey('users', command.aggregateId)
    commandBus.register('UpdateUserName', handler)
    const updateUserNameCommand = createUpdateNameOfUserCommand(
      command.aggregateId,
      { name: 'test' },
      { timestamp: new Date() },
    )
    await commandBus.execute(updateUserNameCommand)
    const events = await eventStore.load(streamKey)
    const event = events.at(-1) as ReturnType<typeof createUserNameUpdatedEvent>

    expect(events).toHaveLength(2)
    expect(event.payload.name).toBe('test')
  })

  it('should throw an error if no handler is registered for the command type', async () => {
    const updateUserNameCommand = createUpdateNameOfUserCommand(command.aggregateId, { name: 'test' }, { timestamp: new Date() })

    await expect(commandBus.execute(updateUserNameCommand)).rejects.toThrow('No handler found for command type: UpdateUserName')
  })

  it('should throw an error if a handler is already registered for the command type', () => {
    commandBus.register('UpdateUserName', handler)

    expect(() => {
      commandBus.register('UpdateUserName', handler)
    }).toThrow('Handler already registered for command type: UpdateUserName')
  })
})
