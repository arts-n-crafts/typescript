import type { UserCommand, UserEvent, UserState } from '@domain/examples/User.ts'
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
import { ResultedCommandBus } from './ResultedCommandBus.ts'

describe('resulted commandBus', () => {
  const command = createRegisterUserCommand(randomUUID(), { name: 'Elon', email: 'musk@x.com', age: 52 })
  let database: Database<StoredEvent<UserEvent>, SimpleDatabaseResult>
  let eventStore: EventStore<UserEvent, SimpleEventStoreResult>
  let repository: Repository<UserEvent, SimpleRepositoryResult, UserState>
  let commandBus: ResultedCommandBus<UserCommand>
  let handler: UpdateUserNameHandler

  beforeEach(async () => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)

    commandBus = new ResultedCommandBus()
    handler = new UpdateUserNameHandler(repository)
    const createUserHandler = new CreateUserHandler(repository)
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(ResultedCommandBus).toBeDefined()
  })

  it('should register a command handler', () => {
    commandBus.register('UpdateUserName', handler)
  })

  it('should process the command via commandBus and return the event', async () => {
    commandBus.register('UpdateUserName', handler)
    const updateUserNameCommand = createUpdateNameOfUserCommand(
      command.aggregateId,
      { name: 'test' },
      { timestamp: new Date() },
    )
    const result = await commandBus.execute(updateUserNameCommand)

    expect(result.isOk()).toBeTruthy()
    expect(result.unwrap().id).toBe(command.aggregateId)
  })

  it('should throw an error if no handler is registered for the command type', async () => {
    const updateUserNameCommand = createUpdateNameOfUserCommand(command.aggregateId, { name: 'test' }, { timestamp: new Date() })

    const result = await commandBus.execute(updateUserNameCommand)
    expect(result.isErr()).toBeTruthy()
    expect(result.unwrapErr().name).toBe('Error')
    expect(result.unwrapErr().message).toBe('No handler found for command type: UpdateUserName')
  })

  it('should throw an error if a handler is already registered for the command type', () => {
    commandBus.register('UpdateUserName', handler)
    const result = commandBus.register('UpdateUserName', handler)

    expect(result.isErr()).toBeTruthy()
    expect(result.unwrapErr().name).toBe('Error')
    expect(result.unwrapErr().message).toBe('Handler already registered for command type: UpdateUserName')
  })
})
