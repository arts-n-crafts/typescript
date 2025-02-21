import type { AggregateRoot } from '../../domain/AggregateRoot/AggregateRoot'
import type { EventStore } from '../EventStore/EventStore'
import type { Repository } from '../Repository/Repository'
import type { MockCreateUserCommandProps } from './mocks/MockCreateUserCommand'
import { describe, expect, it } from 'vitest'
import { MockUserCreatedEvent } from '../../domain/DomainEvent/mocks/MockUserCreated'
import { MockUserNameUpdatedEvent } from '../../domain/DomainEvent/mocks/MockUserNameUpdated'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { MockUserRepository } from '../Repository/mocks/MockUserRepository'
import { MockCreateUserCommand } from './mocks/MockCreateUserCommand'
import { MockCreateUserCommandHandler } from './mocks/MockCreateUserCommandHandler'
import { MockUpdateUserNameCommand } from './mocks/MockUpdateUserNameCommand'
import { MockUpdateUserNameCommandHandler } from './mocks/MockUpdateUserNameCommandHandler'

describe('commandHandler', async () => {
  const eventBus: EventBus = new EventBus()
  const eventStore: EventStore = new InMemoryEventStore(eventBus)
  const repository: Repository<AggregateRoot<unknown>> = new MockUserRepository(eventStore)
  const createUserHandler = new MockCreateUserCommandHandler(repository)
  const props: MockCreateUserCommandProps = {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  }
  const command = new MockCreateUserCommand(props, null)
  const { id } = await createUserHandler.execute(command)
  const aggregateId: string = id

  it('should be defined', () => {
    expect(MockUpdateUserNameCommandHandler).toBeDefined()
  })

  it('should process the MockCreateUser Command and emit the MockUserCreated Event', async () => {
    const events = await eventStore.loadEvents(aggregateId)
    const event = events[0]
    expect(events).toHaveLength(1)
    expect(event).toBeInstanceOf(MockUserCreatedEvent)
    expect(event.aggregateId).toBe(aggregateId)
  })

  it('should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event', async () => {
    const updateUserNameHandler = new MockUpdateUserNameCommandHandler(repository)
    const payload = { aggregateId, name: 'test' }
    const metadata = { timestamp: new Date() }
    const command: MockUpdateUserNameCommand = new MockUpdateUserNameCommand(
      payload,
      metadata,
    )
    await updateUserNameHandler.execute(command)

    const events = await eventStore.loadEvents(aggregateId)
    const event = events[1]
    expect(events).toHaveLength(2)
    expect(event).toBeInstanceOf(MockUserNameUpdatedEvent)
    expect(event.aggregateId).toBe(aggregateId)
  })
})
