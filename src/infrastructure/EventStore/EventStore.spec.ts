import type { DomainEvent } from '@domain/DomainEvent.js'
import type { UserEvent } from '@domain/examples/User.js'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { beforeEach, describe } from 'vitest'
import { InMemoryEventStore } from './implementations/InMemoryEventStore.ts'

const makeUserStreamId = (aggregateId: string) => `user-${aggregateId}`

describe('inMemoryEventStore', () => {
  let eventStore: InMemoryEventStore

  let event1: DomainEvent<unknown>
  let event2: DomainEvent<unknown>
  let event3: DomainEvent<unknown>

  beforeEach(async () => {
    eventStore = new InMemoryEventStore()

    event1 = UserCreated(randomUUID(), { name: 'elon', email: 'musk@x.com' })
    event2 = UserNameUpdated(event1.aggregateId, { name: 'Donald' })
    event3 = UserCreated(randomUUID(), { name: 'Donald', email: 'potus@x.com' })

    await eventStore.append(makeUserStreamId(event1.aggregateId), [event1, event2])
    await eventStore.append(makeUserStreamId(event3.aggregateId), [event3])
  })

  describe('eventStore', () => {
    it('should load the given event', async () => {
      const streamId = makeUserStreamId(event1.aggregateId)
      const events = await eventStore.load<UserEvent>(streamId)
      expect(events[0]).toEqual(event1)
    })

    it('should store and load multiple events', async () => {
      const streamId = makeUserStreamId(event1.aggregateId)
      const events = await eventStore.load(streamId)

      expect(events).toHaveLength(2)
      expect(events[0]).toEqual(event1)
      expect(events[1]).toEqual(event2)
    })

    it('should return an empty array if no events are found', async () => {
      const events = await eventStore.load('non_existent')
      expect(events).toHaveLength(0)
    })
  })

  describe('outbox', () => {
    it('should only have unpublished entries in the outbox', async () => {
      const outbox = eventStore.getOutboxBatch()

      expect(outbox).toHaveLength(3)
      expect(outbox.every(entry => !entry.published))
    })

    it('should acknowledge dispatch in the outbox', async () => {
      eventStore.acknowledgeDispatch(event3.id)
      const outbox = eventStore.getOutboxBatch()
      expect(outbox).toHaveLength(2)
    })

    it('should do nothing if the entry is not in the outbox', async () => {
      eventStore.acknowledgeDispatch(randomUUID())
      const outbox = eventStore.getOutboxBatch()

      expect(outbox).toHaveLength(3)
    })
  })
})
