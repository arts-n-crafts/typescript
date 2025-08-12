import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { UserCreatedEvent } from '@domain/examples/UserCreated.ts'
import type { UserRegistrationEmailSentEvent } from '@domain/examples/UserRegistrationEmailSent.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { EventHandler } from './EventHandler.ts'
import { randomUUID } from 'node:crypto'
import { ContractSignedHandler } from '@core/examples/ContractSignedHandler.ts'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { makeStreamKey } from '@utils/streamKey/index.ts'

describe('eventHandler', () => {
  const store = 'users'
  let database: Database<StoredEvent<UserEvent>>
  let eventStore: EventStore<UserEvent>
  let repository: Repository<UserEvent, UserState>
  let handler: EventHandler<UserCreatedEvent>

  beforeEach(() => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, store, User.evolve, User.initialState)
    handler = new UserCreatedEventHandler(repository)
  })

  it('should be defined', () => {
    expect(UserCreatedEventHandler).toBeDefined()
    expect(ContractSignedHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = createUserCreatedEvent(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await handler.handle(event)
    await repository.load(event.aggregateId)

    const events = await eventStore.load(makeStreamKey(store, event.aggregateId))
    const userRegistrationEmailSentEvent = events[0]

    expect(userRegistrationEmailSentEvent.type).toBe('UserRegistrationEmailSent')
    expect((userRegistrationEmailSentEvent as UserRegistrationEmailSentEvent).payload.status).toBe('SUCCESS')
  })
})
