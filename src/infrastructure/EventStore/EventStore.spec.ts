import type { UserEvent } from '@domain/examples/User.js'
import type { AllEvents } from '@infrastructure/ScenarioTest/examples/User.module.ts'
import type { EventBus } from '../EventBus/EventBus.ts'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { describe } from 'vitest'
import { InMemoryEventBus } from '../EventBus/implementations/InMemoryEventBus.ts'
import { InMemoryEventStore } from './implementations/InMemoryEventStore.ts'

describe('inMemoryEventStore', () => {
  let eventBus: EventBus<AllEvents>
  let eventStore: InMemoryEventStore

  beforeEach(() => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore()
  })

  it('should store and load an event', async () => {
    const aggregateId = randomUUID()
    const streamId = `user-${aggregateId}`
    const event = UserCreated(aggregateId, { name: 'elon', email: 'musk@x.com' })

    await eventStore.append(streamId, [event])
    const events = await eventStore.load<UserEvent>(streamId)
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(event)
  })

  it('should store and load multiple events', async () => {
    const makeUserStreamId = (aggregateId: string) => `user-${aggregateId}`

    const aggregateId = randomUUID()
    const streamId = makeUserStreamId(aggregateId)
    const event = UserCreated(aggregateId, { name: 'elon', email: 'musk@x.com' })
    const event2 = UserNameUpdated(aggregateId, { name: 'Donald' })

    const aggregateId2 = randomUUID()
    const streamId2 = makeUserStreamId(aggregateId2)
    const event3 = UserCreated(aggregateId2, { name: 'Donald', email: 'potus@x.com' })

    await eventStore.append(streamId, [event, event2])
    await eventStore.append(streamId2, [event3])
    const events = await eventStore.load(streamId)

    expect(events).toHaveLength(2)
    expect(events[0]).toEqual(event)
    expect(events[1]).toEqual(event2)
  })

  it('should return an empty array if no events are found', async () => {
    const events = await eventStore.load('non_existent')
    expect(events).toHaveLength(0)
  })

  describe('outbox pattern', () => {
    it('should only have unpublished entries in the outbox', async () => {
      const makeUserStreamId = (aggregateId: string) => `user-${aggregateId}`

      const aggregateId = randomUUID()
      const streamId = makeUserStreamId(aggregateId)
      const event = UserCreated(aggregateId, { name: 'elon', email: 'musk@x.com' })
      const event2 = UserNameUpdated(aggregateId, { name: 'Donald' })

      const aggregateId2 = randomUUID()
      const streamId2 = makeUserStreamId(aggregateId2)
      const event3 = UserCreated(aggregateId2, { name: 'Donald', email: 'potus@x.com' })

      await eventStore.append(streamId, [event, event2])
      await eventStore.append(streamId2, [event3])
      const outbox = eventStore.getOutboxBatch()

      expect(outbox).toHaveLength(3)
      expect(outbox.every(entry => !entry.published))
    })
  })
})
