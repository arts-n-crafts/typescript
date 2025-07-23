import type { UserEvent } from '@domain/examples/User.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { makeStreamKey } from '@utils/streamKey/index.ts'
import { beforeEach, describe } from 'vitest'
import { GenericEventStore } from './implementations/GenericEventStore.ts'

describe('eventStore', () => {
  const STREAM = 'users'
  let database: Database
  let eventStore: GenericEventStore

  let event1: UserEvent
  let event2: UserEvent
  let event3: UserEvent

  beforeEach(async () => {
    database = new InMemoryDatabase()
    eventStore = new GenericEventStore(database)

    event1 = UserCreated(randomUUID(), { name: 'elon', email: 'musk@x.com' })
    event2 = UserNameUpdated(event1.aggregateId, { name: 'Donald' })
    event3 = UserCreated(randomUUID(), { name: 'Donald', email: 'potus@x.com' })

    await eventStore.append(makeStreamKey(STREAM, event1.aggregateId), [event1, event2])
    await eventStore.append(makeStreamKey(STREAM, event3.aggregateId), [event3])
  })

  describe('eventStore', () => {
    it('should load the given event', async () => {
      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const events = await eventStore.load<UserEvent[]>(streamId)
      expect(events[0]).toEqual(event1)
    })

    it('should store and load multiple events', async () => {
      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const events = await eventStore.load<UserEvent[]>(streamId)

      expect(events).toHaveLength(2)
      expect(events[0]).toEqual(event1)
      expect(events[1]).toEqual(event2)
    })

    it('should return an empty array if no events are found', async () => {
      const events = await eventStore.load(makeStreamKey('non_existent', '123'))
      expect(events).toHaveLength(0)
    })
  })
})
