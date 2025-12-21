import type { UserEvent } from '@domain/examples/User.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '../EventStore.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { MultipleAggregatesException } from './SimpleEventStore.exceptions.ts'
import { SimpleEventStore } from './SimpleEventStore.ts'

describe('simpleEventStore', () => {
  const streamName = 'users'
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>

  const userCreatedEvent = createUserCreatedEvent(randomUUID(), { name: 'John Doe', email: 'john.doe@example.com' })
  const userNameUpdatedEvent = createUserNameUpdatedEvent(userCreatedEvent.aggregateId, { name: 'Jack Doe' })

  beforeEach(() => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
  })

  it('should be defined', () => {
    expect(SimpleEventStore).toBeDefined()
  })

  it('should store a single event', async () => {
    const result = await eventStore.append(streamName, [userCreatedEvent])
    expect(result).toBeUndefined()
  })

  it('should store multiple events', async () => {
    const result = await eventStore.append(streamName, [userCreatedEvent, userNameUpdatedEvent])
    expect(result).toBeUndefined()
  })

  it('should throw MultipleAggregatesException when storing events for multiple aggregate', async () => {
    await expect(
      async () => eventStore.append(streamName, [
        userCreatedEvent,
        createUserCreatedEvent(randomUUID(), { name: 'Jane Doe', email: 'jane.doe@example.com' }),
      ]),
    ).rejects.toThrow(MultipleAggregatesException)
  })

  it('should be able to retrieve stored events', async () => {
    await eventStore.append(streamName, [userCreatedEvent])
    const events = await eventStore.load(streamName, userCreatedEvent.aggregateId)
    expect(events).toEqual([userCreatedEvent])
  })
})
