import { randomUUID } from 'node:crypto'
import { UserCreated } from '../../domain/DomainEvent/examples/UserCreated'
import { UserNameUpdated } from '../../domain/DomainEvent/examples/UserNameUpdated'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from './implementations/InMemoryEventStore'

describe('inMemoryEventStore', () => {
  let eventBus: EventBus
  let eventStore: InMemoryEventStore

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
  })

  it('should store and load an event', async () => {
    const aggregateId = randomUUID()
    const event = UserCreated(aggregateId, 1, { name: 'elon', email: 'musk@x.com' })

    await eventStore.store(event)
    const events = await eventStore.loadEvents(aggregateId)
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(event)
  })

  it('should store and load multiple events', async () => {
    const aggregateId = randomUUID()
    const event = UserCreated(aggregateId, 1, { name: 'elon', email: 'musk@x.com' })
    const event2 = UserNameUpdated(aggregateId, 2, { name: 'Donald' })
    const event3 = UserCreated(randomUUID(), 1, { name: 'Donald', email: 'potus@x.com' })

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
