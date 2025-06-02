import type { IEventStore } from '../EventStore/IEventStore'
import type { CreateUserProps } from './examples/CreateUser'
import { randomUUID } from 'node:crypto'
import { User } from '../../domain/AggregateRoot/examples/User'
import { isDomainEvent } from '../../domain/DomainEvent/utils/isDomainEvent'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { UserRepository } from '../Repository/examples/UserRepository'
import { CreateUser } from './examples/CreateUser'
import { CreateUserHandler } from './examples/CreateUserHandler'
import { UpdateUserName } from './examples/UpdateUserName'
import { UpdateUserNameHandler } from './examples/UpdateUserNameHandler'

describe('commandHandler', async () => {
  const aggregateId = randomUUID()
  const eventBus: EventBus = new EventBus()
  const eventStore: IEventStore = new InMemoryEventStore(eventBus)
  const repository = new UserRepository(eventStore, User)
  const createUserHandler = new CreateUserHandler(repository)
  const props: CreateUserProps = {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  }
  const command = CreateUser(aggregateId, props)
  await createUserHandler.execute(command)

  it('should be defined', () => {
    expect(UpdateUserNameHandler).toBeDefined()
  })

  it('should process the MockCreateUser Command and emit the MockUserCreated Event', async () => {
    const events = await eventStore.loadEvents(aggregateId)
    const event = events[0]
    expect(events).toHaveLength(1)
    expect(event.type).toBe('UserCreated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(aggregateId)
  })

  it('should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event', async () => {
    const updateUserNameHandler = new UpdateUserNameHandler(repository)
    const payload = { aggregateId, name: 'test' }
    const metadata = { timestamp: new Date() }
    const command = UpdateUserName(aggregateId, payload, metadata)
    await updateUserNameHandler.execute(command)

    const events = await eventStore.loadEvents(aggregateId)
    const event = events[1]
    expect(events).toHaveLength(2)
    expect(event.type).toBe('UserNameUpdated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(aggregateId)
  })
})
