import type { UserEvent } from '@domain/examples/User.js'
import type { EventStore } from './EventStore.ts'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { makeStreamKey } from '@utils/streamKey/index.js'
import { beforeEach, describe } from 'vitest'
import { InMemoryEventStore } from './implementations/InMemoryEventStore.ts'

describe('inMemoryEventStore', () => {
  const STREAM = 'users'
  let eventStore: EventStore

  let event1: UserEvent
  let event2: UserEvent
  let event3: UserEvent

  beforeEach(async () => {
    eventStore = new InMemoryEventStore()

    event1 = UserCreated(randomUUID(), { name: 'elon', email: 'musk@x.com' })
    event2 = UserNameUpdated(event1.aggregateId, { name: 'Donald' })
    event3 = UserCreated(randomUUID(), { name: 'Donald', email: 'potus@x.com' })

    await eventStore.append(makeStreamKey(STREAM, event1.aggregateId), [event1, event2])
    await eventStore.append(makeStreamKey(STREAM, event3.aggregateId), [event3])
  })

  describe('eventStore', () => {
    it('should load the given event', async () => {
      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const events = await eventStore.load(streamId)
      expect(events[0]).toEqual(event1)
    })

    it('should store and load multiple events', async () => {
      const streamId = makeStreamKey(STREAM, event1.aggregateId)
      const events = await eventStore.load(streamId)

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
