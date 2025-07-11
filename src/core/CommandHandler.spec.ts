import type { CreateUserProps } from '@core/examples/CreateUser.ts'
import { randomUUID } from 'node:crypto'
import { CreateUser } from '@core/examples/CreateUser.ts'
import { UpdateUserName } from '@core/examples/UpdateUserName.ts'
import { User } from '@domain/examples/User.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { InMemoryEventBus } from '@infrastructure/EventBus/implementations/InMemoryEventBus.js'
import { InMemoryEventStore } from '@infrastructure/EventStore/implementations/InMemoryEventStore.js'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.js'
import { makeStreamKey } from '@utils/streamKey/index.js'
import { CreateUserHandler } from './examples/CreateUserHandler.ts'
import { UpdateUserNameHandler } from './examples/UpdateUserNameHandler.ts'

describe('commandHandler', async () => {
  const eventBus = new InMemoryEventBus()
  const eventStore = new InMemoryEventStore(eventBus)
  const repository = new UserRepository(eventStore, 'users', User.evolve, User.initialState)
  const aggregateId = randomUUID()
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
    const streamKey = makeStreamKey('users', aggregateId)
    const events = await eventStore.load(streamKey)
    const event = events.at(0)
    expect(events).toHaveLength(1)
    expect(event?.type).toBe('UserCreated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(aggregateId)
  })

  it('should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event', async () => {
    const updateUserNameHandler = new UpdateUserNameHandler(repository)
    const updateUserNameCommand = UpdateUserName(aggregateId, { name: 'test' })
    await updateUserNameHandler.execute(updateUserNameCommand)
    const streamKey = makeStreamKey('users', aggregateId)
    const events = await eventStore.load(streamKey)
    const event = events.at(1)
    expect(events).toHaveLength(2)
    expect(event?.type).toBe('UserNameUpdated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(aggregateId)
  })
})
