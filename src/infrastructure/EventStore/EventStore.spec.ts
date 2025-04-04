import { beforeEach, describe, expect, it } from 'vitest'
import { DomainEvent } from '../../domain/DomainEvent_v1/DomainEvent'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from './implementations/InMemoryEventStore'

describe('inMemoryEventStore', () => {
  class SomeDomainEvent extends DomainEvent<Record<string, unknown>> { };

  let eventBus: EventBus
  let eventStore: InMemoryEventStore

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
  })

  it('should store and load an event', async () => {
    const event = new SomeDomainEvent('123', { data: 'test' })

    await eventStore.store(event)
    const events = await eventStore.loadEvents('123')

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(event)
  })

  it('should store and load multiple events', async () => {
    const event = new SomeDomainEvent('123', { data: 'test' })
    const event2 = new SomeDomainEvent('123', { data: 'test2' })
    const event3 = new SomeDomainEvent('1234', { data: 'test' })

    await eventStore.store(event)
    await eventStore.store(event2)
    await eventStore.store(event3)
    const events = await eventStore.loadEvents('123')

    expect(events).toHaveLength(2)
    expect(events[0]).toEqual(event)
    expect(events[1]).toEqual(event2)
  })

  it('should return an empty array if no events are found', async () => {
    const events = await eventStore.loadEvents('non_existent')
    expect(events).toHaveLength(0)
  })
})
