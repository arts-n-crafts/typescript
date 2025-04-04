import type { AggregateRoot } from '../../domain/AggregateRoot/AggregateRoot'
import type { EventStore } from '../EventStore/EventStore'
import type { Repository } from '../Repository/Repository'
import type { CreateUserCommandProps } from './examples/CreateUserCommand'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { UserCreatedEvent } from '../../domain/DomainEvent_v1/examples/UserCreated'
import { UserNameUpdatedEvent } from '../../domain/DomainEvent_v1/examples/UserNameUpdated'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { UserRepository } from '../Repository/examples/UserRepository'
import { CreateUserCommand } from './examples/CreateUserCommand'
import { CreateUserCommandHandler } from './examples/CreateUserCommandHandler'
import { UpdateUserNameCommand } from './examples/UpdateUserNameCommand'
import { UpdateUserNameCommandHandler } from './examples/UpdateUserNameCommandHandler'

describe('commandHandler', async () => {
  const aggregateId = randomUUID()
  const eventBus: EventBus = new EventBus()
  const eventStore: EventStore = new InMemoryEventStore(eventBus)
  const repository: Repository<AggregateRoot<unknown>> = new UserRepository(eventStore)
  const createUserHandler = new CreateUserCommandHandler(repository)
  const props: CreateUserCommandProps = {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  }
  const command = new CreateUserCommand(aggregateId, props, null)
  await createUserHandler.execute(command)

  it('should be defined', () => {
    expect(UpdateUserNameCommandHandler).toBeDefined()
  })

  it('should process the MockCreateUser Command and emit the MockUserCreated Event', async () => {
    const events = await eventStore.loadEvents(aggregateId)
    const event = events[0]
    expect(events).toHaveLength(1)
    expect(event).toBeInstanceOf(UserCreatedEvent)
    expect(event.aggregateId).toBe(aggregateId)
  })

  it('should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event', async () => {
    const updateUserNameHandler = new UpdateUserNameCommandHandler(repository)
    const payload = { aggregateId, name: 'test' }
    const metadata = { timestamp: new Date() }
    const command: UpdateUserNameCommand = new UpdateUserNameCommand(aggregateId, payload, metadata)
    await updateUserNameHandler.execute(command)

    const events = await eventStore.loadEvents(aggregateId)
    const event = events[1]
    expect(events).toHaveLength(2)
    expect(event).toBeInstanceOf(UserNameUpdatedEvent)
    expect(event.aggregateId).toBe(aggregateId)
  })
})
