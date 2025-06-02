import type { UUID } from 'node:crypto'
import type { IRepository } from '../../domain'
import type { UserNameUpdated } from '../../domain/DomainEvent/examples/UserNameUpdated'
import type { IEventStore } from '../EventStore/IEventStore'
import { randomUUID } from 'node:crypto'
import { User } from '../../domain/AggregateRoot/examples/User'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { UserRepository } from '../Repository/examples/UserRepository'
import { CommandBus } from './CommandBus'
import { CreateUser } from './examples/CreateUser'
import { CreateUserHandler } from './examples/CreateUserHandler'
import { UpdateUserName } from './examples/UpdateUserName'
import { UpdateUserNameHandler } from './examples/UpdateUserNameHandler'

describe('commandBus', () => {
  let id: UUID
  let eventBus: EventBus
  let eventStore: IEventStore
  let repository: IRepository<User>
  let commandBus: CommandBus
  let handler: UpdateUserNameHandler

  beforeEach(async () => {
    id = randomUUID()
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new UserRepository(eventStore, User)
    commandBus = new CommandBus()
    handler = new UpdateUserNameHandler(repository)

    const createUserHandler = new CreateUserHandler(repository)
    const command = CreateUser(id, { name: 'Elon', email: 'musk@x.com', age: 52 })
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(CommandBus).toBeDefined()
  })

  it('should register a command handler', () => {
    commandBus.register('UpdateUserName', handler)
  })

  it('should process the command via commandBus and return the event', async () => {
    commandBus.register('UpdateUserName', handler)

    const command = UpdateUserName(id, { name: 'test' }, { timestamp: new Date() })
    await commandBus.execute(command)

    const events = await eventStore.loadEvents(id)
    const event = events.at(-1) as ReturnType<typeof UserNameUpdated>
    expect(events).toHaveLength(2)
    expect(event.payload.name).toBe('test')
  })

  it('should throw an error if no handler is registered for the command type', async () => {
    const command = UpdateUserName(id, { name: 'test' }, { timestamp: new Date() })

    await expect(commandBus.execute(command)).rejects.toThrow('No handler found for command type: UpdateUserName')
  })

  it('should throw an error if a handler is already registered for the command type', () => {
    commandBus.register('UpdateUserName', handler)

    expect(() => {
      commandBus.register('UpdateUserName', handler)
    }).toThrow('Handler already registered for command type: UpdateUserName')
  })
})
