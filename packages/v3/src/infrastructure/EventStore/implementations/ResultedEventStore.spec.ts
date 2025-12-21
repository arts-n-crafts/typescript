import type { UserEvent } from '@domain/examples/User.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { ResultedDatabaseExecuteReturnType } from '@infrastructure/Database/implementations/ResultedDatabase.ts'
import type { Result } from 'oxide.ts'
import type { EventStore } from '../EventStore.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import type { ResultedEventStoreAppendReturnType } from './ResultedEventStore.ts'
import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { ResultedDatabase } from '@infrastructure/Database/implementations/ResultedDatabase.ts'
import { ResultedEventStore } from './ResultedEventStore.ts'
import { MultipleAggregatesException } from './SimpleEventStore.exceptions.ts'

describe('resultedEventStore', () => {
  const streamName = 'users'
  let database: Database<StoredEvent<UserEvent>, Promise<ResultedDatabaseExecuteReturnType>, Promise<Result<StoredEvent<UserEvent>[], Error>>>
  let eventStore: EventStore<UserEvent, Promise<ResultedEventStoreAppendReturnType>, Promise<Result<UserEvent[], Error>>>

  const userCreatedEvent = createUserCreatedEvent(randomUUID(), { name: 'John Doe', email: 'john.doe@example.com' })
  const userNameUpdatedEvent = createUserNameUpdatedEvent(userCreatedEvent.aggregateId, { name: 'Jack Doe' })

  beforeEach(() => {
    database = new ResultedDatabase()
    eventStore = new ResultedEventStore(database)
  })

  it('should be defined', () => {
    expect(ResultedEventStore).toBeDefined()
  })

  it('should store a single event', async () => {
    const result = await eventStore.append(streamName, [userCreatedEvent])
    expect(result.isOk()).toBeTruthy()
    expect(result.unwrap().id).toBe(userCreatedEvent.aggregateId)
  })

  it('should store multiple events', async () => {
    const result = await eventStore.append(streamName, [userCreatedEvent, userNameUpdatedEvent])
    expect(result.isOk()).toBeTruthy()
    expect(result.unwrap().id).toBe(userCreatedEvent.aggregateId)
  })

  it('should throw MultipleAggregatesException when storing events for multiple aggregate', async () => {
    const result = await eventStore.append(streamName, [
      userCreatedEvent,
      createUserCreatedEvent(randomUUID(), { name: 'Jane Doe', email: 'jane.doe@example.com' }),
    ])
    expect(result.isErr()).toBeTruthy()
    expect(result.unwrapErr()).toBeInstanceOf(MultipleAggregatesException)
  })

  it('should be able to retrieve stored events', async () => {
    const result = await eventStore.append(streamName, [userCreatedEvent])
    const events = await eventStore.load(streamName, userCreatedEvent.aggregateId)
    expect(result.isOk()).toBeTruthy()
    expect(result.unwrap().id).toBe(userCreatedEvent.aggregateId)
    expect(events.isOk()).toBeTruthy()
    expect(events.unwrap()).toEqual([userCreatedEvent])
  })
})
