import type { UUID } from 'node:crypto'
import type { AggregateRoot } from '../../domain/AggregateRoot/AggregateRoot'
import type { UserNameUpdatedEvent } from '../../domain/DomainEvent_v1/examples/UserNameUpdated'
import type { EventStore } from '../EventStore/EventStore'
import type { Repository } from '../Repository/Repository'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { UserRepository } from '../Repository/examples/UserRepository'
import { CommandBus } from './CommandBus'
import { CreateUserCommand } from './examples/CreateUserCommand'
import { CreateUserCommandHandler } from './examples/CreateUserCommandHandler'
import { UpdateUserNameCommand } from './examples/UpdateUserNameCommand'
import { UpdateUserNameCommandHandler } from './examples/UpdateUserNameCommandHandler'

describe('commandBus', () => {
  let id: UUID
  let eventBus: EventBus
  let eventStore: EventStore
  let repository: Repository<AggregateRoot<unknown>>
  let commandBus: CommandBus
  let handler: UpdateUserNameCommandHandler

  beforeEach(async () => {
    id = randomUUID()
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new UserRepository(eventStore)
    commandBus = new CommandBus()
    handler = new UpdateUserNameCommandHandler(repository)

    const createUserHandler = new CreateUserCommandHandler(repository)
    const command = new CreateUserCommand(id, { name: 'Elon', email: 'musk@x.com', age: 52 }, null)
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(CommandBus).toBeDefined()
  })

  it('should register a command handler', () => {
    commandBus.register(UpdateUserNameCommand, handler)
  })

  it('should process the command via commandBus and return the event', async () => {
    commandBus.register(UpdateUserNameCommand, handler)

    const command: UpdateUserNameCommand = new UpdateUserNameCommand(id, { name: 'test' }, { timestamp: new Date() })
    await commandBus.execute(command)

    const events = await eventStore.loadEvents(id)
    const event = events.at(-1) as UserNameUpdatedEvent
    expect(events).toHaveLength(2)
    expect(event.payload.name).toBe('test')
  })

  it('should throw an error if no handler is registered for the command type', async () => {
    const command: UpdateUserNameCommand = new UpdateUserNameCommand(id, { name: 'test' }, { timestamp: new Date() })

    await expect(commandBus.execute(command)).rejects.toThrow('No handler found for command type: UpdateUserNameCommand')
  })

  it('should throw an error if a handler is already registered for the command type', () => {
    commandBus.register(UpdateUserNameCommand, handler)

    expect(() => {
      commandBus.register(UpdateUserNameCommand, handler)
    }).toThrow('Handler already registered for command type: UpdateUserNameCommand')
  })
})
