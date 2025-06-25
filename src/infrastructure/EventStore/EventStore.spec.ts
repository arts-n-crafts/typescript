import type { UserEvent } from '@domain/examples/User.ts'
import type { EventBus } from '../EventBus/EventBus.ts'
import type { EventStore } from './EventStore.ts'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { InMemoryEventBus } from '../EventBus/implementations/InMemoryEventBus.ts'
import { InMemoryEventStore } from './implementations/InMemoryEventStore.ts'

describe('inMemoryEventStore', () => {
  let eventBus: EventBus<UserEvent>
  let eventStore: EventStore<UserEvent>

  beforeEach(() => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore(eventBus)
  })

  it('should store and load an event', async () => {
    const aggregateId = randomUUID()
    const event = UserCreated(aggregateId, { name: 'elon', email: 'musk@x.com' })

    await eventStore.store(event)
    const events = await eventStore.loadEvents(aggregateId)
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(event)
  })

  it('should store and load multiple events', async () => {
    const aggregateId = randomUUID()
    const event = UserCreated(aggregateId, { name: 'elon', email: 'musk@x.com' })
    const event2 = UserNameUpdated(aggregateId, { name: 'Donald' })
    const event3 = UserCreated(randomUUID(), { name: 'Donald', email: 'potus@x.com' })

    await eventStore.store(event)
    await eventStore.store(event2)
    await eventStore.store(event3)
    const events = await eventStore.loadEvents(aggregateId)

    expect(events).toHaveLength(2)
    expect(events[0]).toEqual(event)
    expect(events[1]).toEqual(event2)
  })

  it('should return an empty array if no events are found', async () => {
    const events = await eventStore.loadEvents('non_existent')
    expect(events).toHaveLength(0)
  })
})
