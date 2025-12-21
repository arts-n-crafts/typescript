/* eslint ts/no-unsafe-assignment: 0 */ // expect.objectContaining has any type, unfortunately
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'

describe('userCreatedEventHandler', () => {
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>
  let repository: Repository<UserEvent, Promise<UserState>>
  let handler: UserCreatedEventHandler
  const event = createUserCreatedEvent(randomUUID(), {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  })

  beforeEach(async () => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)
    handler = new UserCreatedEventHandler(repository)
  })

  it('should be defined', () => {
    expect(UserCreatedEventHandler).toBeDefined()
  })

  it('should send an email', async () => {
    await handler.handle(event)
    const events = await eventStore.load('users', event.aggregateId)
    expect(events).toHaveLength(1)
    expect(events).toStrictEqual(expect.arrayContaining([
      expect.objectContaining({
        aggregateId: event.aggregateId,
        aggregateType: 'User',
        id: expect.any(String),
        kind: 'domain',
        metadata: {
          causationId: event.id,
        },
        payload: {
          status: 'SUCCESS',
        },
        timestamp: expect.any(Number),
        type: 'UserRegistrationEmailSent',
      }),
    ]))
  })

  it('should not send an email if the event is not a user created event', async () => {
    const event = createUserNameUpdatedEvent(randomUUID(), { name: 'Henk' })
    await handler.handle(event)
    const events = await eventStore.load('users', event.aggregateId)
    expect(events).toHaveLength(0)
  })
})
