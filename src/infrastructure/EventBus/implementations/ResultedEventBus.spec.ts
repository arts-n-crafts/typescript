import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { Result } from 'oxide.ts'
import type { EventBus } from '../EventBus.ts'
import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { makeStreamKey } from '@utils/streamKey/index.ts'
import { ResultedEventBus } from './ResultedEventBus.ts'

describe('resulted event bus', () => {
  const store = 'users'
  let database: Database<StoredEvent<UserEvent>>
  let eventStore: EventStore<UserEvent>
  let repository: Repository<UserEvent, UserState>
  let eventBus: EventBus<UserEvent, Result<void, never>, Result<void, never>>

  beforeEach(() => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, store, User.evolve, User.initialState)
    eventBus = new ResultedEventBus()
  })

  it('should be defined', () => {
    expect(ResultedEventBus).toBeDefined()
  })

  it('should be able publish events', async () => {
    const createdEvent = createUserCreatedEvent(randomUUID(), { name: 'test', email: 'musk@x.com' })

    const subscribeResult = eventBus.subscribe(createdEvent.type, new UserCreatedEventHandler(repository))
    const publishResult = await eventBus.publish(createdEvent)
    const events = await eventStore.load(makeStreamKey(store, createdEvent.aggregateId))
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)

    expect(publishResult.isOk()).toBeTruthy()
    expect(subscribeResult.isOk()).toBeTruthy()
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })

  it('should not mutate if handler is not subscribed', async () => {
    const createdEvent = createUserCreatedEvent(randomUUID(), { name: 'test', email: 'musk@x.com' })

    const publishResult = await eventBus.publish(createdEvent)
    const events = await eventStore.load(makeStreamKey(store, createdEvent.aggregateId))

    expect(publishResult.isOk()).toBeTruthy()
    expect(events.length).toBe(0)
  })
})
