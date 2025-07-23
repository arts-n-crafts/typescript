import type { UserEvent } from '@domain/examples/User.ts'
import type { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { randomUUID } from 'node:crypto'
import { CreateUser } from '@core/examples/CreateUser.ts'
import { CreateUserHandler } from '@core/examples/CreateUserHandler.ts'
import { UpdateUserName } from '@core/examples/UpdateUserName.ts'
import { UpdateUserNameHandler } from '@core/examples/UpdateUserNameHandler.ts'
import { User } from '@domain/examples/User.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { GenericEventStore } from '@infrastructure/EventStore/implementations/GenericEventStore.ts'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { makeStreamKey } from '@utils/streamKey/makeStreamKey.ts'
import { InMemoryCommandBus } from './implementations/InMemoryCommandBus.ts'

describe('commandBus', () => {
  const command = CreateUser(randomUUID(), { name: 'Elon', email: 'musk@x.com', age: 52 })

  const database = new InMemoryDatabase()
  const eventStore = new GenericEventStore(database)
  const repository = new UserRepository(eventStore, 'users', User.evolve, User.initialState)
  let commandBus: InMemoryCommandBus
  let handler: UpdateUserNameHandler

  beforeEach(async () => {
    commandBus = new InMemoryCommandBus()
    handler = new UpdateUserNameHandler(repository)
    const createUserHandler = new CreateUserHandler(repository)
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(InMemoryCommandBus).toBeDefined()
  })

  it('should register a command handler', () => {
    commandBus.register('UpdateUserName', handler)
  })

  it('should process the command via commandBus and return the event', async () => {
    const streamKey = makeStreamKey('users', command.aggregateId)
    commandBus.register('UpdateUserName', handler)
    const updateUserNameCommand = UpdateUserName(
      command.aggregateId,
      { name: 'test' },
      { timestamp: new Date() },
    )
    await commandBus.execute(updateUserNameCommand)
    const events = await eventStore.load<UserEvent[]>(streamKey)
    const event = events.at(-1) as ReturnType<typeof UserNameUpdated>

    expect(events).toHaveLength(2)
    expect(event.payload.name).toBe('test')
  })

  it('should throw an error if no handler is registered for the command type', async () => {
    const updateUserNameCommand = UpdateUserName(command.aggregateId, { name: 'test' }, { timestamp: new Date() })

    await expect(commandBus.execute(updateUserNameCommand)).rejects.toThrow('No handler found for command type: UpdateUserName')
  })

  it('should throw an error if a handler is already registered for the command type', () => {
    commandBus.register('UpdateUserName', handler)

    expect(() => {
      commandBus.register('UpdateUserName', handler)
    }).toThrow('Handler already registered for command type: UpdateUserName')
  })
})
