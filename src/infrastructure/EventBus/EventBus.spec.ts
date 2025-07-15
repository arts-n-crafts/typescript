import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.js'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.js'
import { makeStreamKey } from '@utils/streamKey/index.js'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore.ts'
import { InMemoryEventBus } from './implementations/InMemoryEventBus.ts'

describe('eventBus', () => {
  const eventBus = new InMemoryEventBus()
  let eventStore: InMemoryEventStore
  let repository: UserRepository

  beforeEach(() => {
    eventStore = new InMemoryEventStore()
    repository = new UserRepository(eventStore, 'users', User.evolve, User.initialState)
  })

  it('should be defined', () => {
    expect(InMemoryEventBus).toBeDefined()
  })

  it('should be able publish events', async () => {
    eventBus.subscribe('UserCreated', new UserCreatedEventHandler(repository))
    const createdEvent = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await eventBus.publish(createdEvent)

    const events = await eventStore.load(
      makeStreamKey('users', createdEvent.aggregateId),
    )
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })
})
