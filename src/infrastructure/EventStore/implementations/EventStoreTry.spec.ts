import type { UserEvent } from '@domain/examples/User.ts'
import type { Database } from '@infrastructure/Database/Database.js'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { OfflineDatabase } from '@infrastructure/Database/implementations/OfflineDatabase.ts'
import { OfflineOutbox } from '@infrastructure/Outbox/implementations/OfflineOutbox.ts'
import { makeStreamKey } from '@utils/streamKey/index.ts'
import { beforeEach, describe } from 'vitest'
import { EventStoreTry } from './EventStoreTry.ts'

describe('eventStore with go-like return types', () => {
  const STREAM = 'users'
  let database: Database
  let eventStore: EventStoreTry

  let event1: UserEvent
  let event2: UserEvent
  let event3: UserEvent

  beforeEach(async () => {
    event1 = UserCreated(randomUUID(), { name: 'elon', email: 'musk@x.com' })
    event2 = UserNameUpdated(event1.aggregateId, { name: 'Donald' })
    event3 = UserCreated(randomUUID(), { name: 'Donald', email: 'potus@x.com' })
  })

  describe('eventStore with in-memory database', () => {
    beforeEach(async () => {
      database = new InMemoryDatabase()
      eventStore = new EventStoreTry(database)

      await eventStore.append(makeStreamKey(STREAM, event1.aggregateId), [event1, event2])
      await eventStore.append(makeStreamKey(STREAM, event3.aggregateId), [event3])
    })
    it('should load the given event', async () => {
      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const [events, err] = await eventStore.load<UserEvent>(streamId)
      expect(err).toBeUndefined()
      expect(events![0]).toEqual(event1)
    })

    it('should store and load multiple events', async () => {
      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const [events, err] = await eventStore.load<UserEvent>(streamId)

      expect(err).toBeUndefined()
      expect(events).toHaveLength(2)
      expect(events![0]).toEqual(event1)
      expect(events![1]).toEqual(event2)
    })

    it('should return an empty array if no events are found', async () => {
      const [events, err] = await eventStore.load(makeStreamKey('non_existent', '123'))
      expect(err).toBeUndefined()
      expect(events).toHaveLength(0)
    })
  })

  describe('eventStore with offline services', () => {
    it('should error if the database (read) is offline', async () => {
      database = new OfflineDatabase()
      eventStore = new EventStoreTry(database)

      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const [events, err] = await eventStore.append(streamId, [event1])
      expect(err).toBeInstanceOf(Error)
      expect(err).toStrictEqual(new Error('Failed to load stream from the EventStore'))
      expect(events).toBeUndefined()
    })
    it('should error if the database (write) is offline', async () => {
      database = new OfflineDatabase(true)
      eventStore = new EventStoreTry(database)

      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const [events, err] = await eventStore.append(streamId, [event1])
      expect(err).toBeInstanceOf(Error)
      expect(err).toStrictEqual(new Error('Failed to store events in the EventStore'))
      expect(events).toBeUndefined()
    })
    it('should error if the outbox is offline', async () => {
      database = new OfflineDatabase(true, true)
      eventStore = new EventStoreTry(database, { outbox: new OfflineOutbox() })

      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const [events, err] = await eventStore.append(streamId, [event1])
      expect(err).toBeInstanceOf(Error)
      expect(err).toStrictEqual(new Error('Failed to enqueue events in the Outbox'))
      expect(events).toBeUndefined()
    })
  })
})
