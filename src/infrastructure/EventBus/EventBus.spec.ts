import type { UserEvent } from '@domain/examples/User.ts'
import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { makeStreamKey } from '@utils/streamKey/index.ts'
import { GenericEventStore } from '../EventStore/implementations/GenericEventStore.ts'
import { InMemoryEventBus } from './implementations/InMemoryEventBus.ts'

describe('eventBus', () => {
  let database: InMemoryDatabase
  const eventBus = new InMemoryEventBus()
  let eventStore: GenericEventStore
  let repository: UserRepository

  beforeEach(() => {
    database = new InMemoryDatabase()
    eventStore = new GenericEventStore(database)
    repository = new UserRepository(eventStore, 'users', User.evolve, User.initialState)
  })

  it('should be defined', () => {
    expect(InMemoryEventBus).toBeDefined()
  })

  it('should be able publish events', async () => {
    eventBus.subscribe('UserCreated', new UserCreatedEventHandler(repository))
    const createdEvent = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await eventBus.publish(createdEvent)

    const events = await eventStore.load<UserEvent[]>(
      makeStreamKey('users', createdEvent.aggregateId),
    )
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })
})
