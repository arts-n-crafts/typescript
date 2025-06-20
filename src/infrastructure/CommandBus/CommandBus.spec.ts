import type { UUID } from 'node:crypto'
import type { Repository } from '../../domain'
import type { UserEvent } from '../../domain/examples/User.ts'
import type { UserNameUpdated } from '../../domain/examples/UserNameUpdated.ts'
import { randomUUID } from 'node:crypto'
import { CreateUserHandler } from '../../core/examples/CreateUserHandler.ts'
import { UpdateUserNameHandler } from '../../core/examples/UpdateUserNameHandler.ts'
import { CreateUser } from '../../domain/examples/CreateUser.ts'
import { UpdateUserName } from '../../domain/examples/UpdateUserName.ts'
import { InMemoryCommandBus } from './implementations/InMemoryCommandBus.ts'

describe('commandBus', () => {
  let id: UUID
  let events: UserEvent[] = []
  const repository: Repository<UserEvent> = {
    async load() {
      return events
    },
    async store(e) {
      events = [...events, ...e]
    },
  }
  let commandBus: InMemoryCommandBus
  let handler: UpdateUserNameHandler

  beforeEach(async () => {
    id = randomUUID()
    commandBus = new InMemoryCommandBus()
    handler = new UpdateUserNameHandler(repository)
    events = []
    const createUserHandler = new CreateUserHandler(repository)
    const command = CreateUser(id, { name: 'Elon', email: 'musk@x.com', age: 52 })
    await createUserHandler.execute(command)
  })

  it('should be defined', () => {
    expect(InMemoryCommandBus).toBeDefined()
  })

  it('should register a command handler', () => {
    commandBus.register('UpdateUserName', handler)
  })

  it('should process the command via commandBus and return the event', async () => {
    commandBus.register('UpdateUserName', handler)

    const command = UpdateUserName(id, { name: 'test' }, { timestamp: new Date() })
    await commandBus.execute(command)

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
