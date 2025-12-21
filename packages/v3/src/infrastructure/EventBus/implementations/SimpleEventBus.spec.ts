import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { EventConsumer, EventProducer } from '../EventBus.ts'
import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { SimpleEventBus } from './SimpleEventBus.ts'

describe('eventBus', () => {
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>
  let repository: Repository<UserEvent, Promise<UserState>>
  let eventBus: EventConsumer<UserEvent> & EventProducer<UserEvent>

  beforeEach(() => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)
    eventBus = new SimpleEventBus()
  })

  it('should be defined', () => {
    expect(SimpleEventBus).toBeDefined()
  })

  it('should be able publish events', async () => {
    eventBus.subscribe('users', new UserCreatedEventHandler(repository))
    const createdEvent = createUserCreatedEvent(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await eventBus.publish('users', createdEvent)

    const events = await eventStore.load('users', createdEvent.aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })

  it('should be able to consume events', async () => {
    eventBus.subscribe('users', new UserCreatedEventHandler(repository))
    const createdEvent = createUserCreatedEvent(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await eventBus.consume('users', createdEvent)

    const events = await eventStore.load('users', createdEvent.aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })

  it('should do nothing if no handlers are subscribed', async () => {
    const createdEvent = createUserCreatedEvent(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await eventBus.consume('users', createdEvent)

    const events = await eventStore.load('users', createdEvent.aggregateId)
    expect(events.length).toBe(0)
  })
})
