import type { EventHandler } from '@core/EventHandler.js'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { UserCreatedEvent } from '@domain/examples/UserCreated.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventConsumer, EventProducer } from '@infrastructure/EventBus/EventBus.js'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { Result } from 'oxide.ts'
import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { ResultedEventBus } from './ResultedEventBus.ts'

describe('resulted event bus', () => {
  const store = 'users'
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>
  let repository: Repository<UserEvent, Promise<UserState>>
  let eventBus: EventConsumer<UserEvent, EventHandler<UserCreatedEvent>, Promise<Result<void, Error>>, Result<void, never>> & EventProducer<UserEvent, Promise<Result<void, Error>>>
  const createdEvent = createUserCreatedEvent(randomUUID(), { name: 'test', email: 'musk@x.com' })

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
    const subscribeResult = eventBus.subscribe('users', new UserCreatedEventHandler(repository))

    const publishResult = await eventBus.publish('users', createdEvent)
    const events = await eventStore.load(store, createdEvent.aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)

    expect(publishResult.isOk()).toBeTruthy()
    expect(subscribeResult.isOk()).toBeTruthy()
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })

  it('should not mutate if handler is not subscribed', async () => {
    const publishResult = await eventBus.publish('users', createdEvent)
    const events = await eventStore.load(store, createdEvent.aggregateId)

    expect(publishResult.isOk()).toBeTruthy()
    expect(events.length).toBe(0)
  })

  it('should be able to consume events', async () => {
    const subscribeResult = eventBus.subscribe('users', new UserCreatedEventHandler(repository))

    const publishResult = await eventBus.consume('users', createdEvent)
    const events = await eventStore.load(store, createdEvent.aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)

    expect(publishResult.isOk()).toBeTruthy()
    expect(subscribeResult.isOk()).toBeTruthy()
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })

  it('should aggregate errors if consumers failed', async () => {
    const failingHandler: EventHandler<UserCreatedEvent> = {
      async handle(): Promise<void> {
        throw new Error('offline')
      },
    }
    eventBus.subscribe('users', failingHandler)
    eventBus.subscribe('users', failingHandler)
    eventBus.subscribe('users', failingHandler)

    const [errors] = (await eventBus.consume('users', createdEvent)).intoTuple()

    expect(errors).toBeDefined()
    expect(errors).toBeInstanceOf(AggregateError)
    expect((errors as AggregateError).errors.length).toBe(3)
    expect(((errors as AggregateError).errors[0])).toBeInstanceOf(Error)
    expect(((errors as AggregateError).errors[0] as Error).message).toBe('offline')
  })
})
