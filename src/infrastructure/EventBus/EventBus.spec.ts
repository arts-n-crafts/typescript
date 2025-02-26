import type { UserCreatedEventProps } from '../../domain/DomainEvent/examples/UserCreated'
import type { EventStore } from '../EventStore/EventStore'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserCreatedEvent } from '../../domain/DomainEvent/examples/UserCreated'
import { UserRegistrationEmailSentEvent } from '../../domain/DomainEvent/examples/UserRegistrationEmailSent'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { EventBus } from './EventBus'
import { UserCreatedEventHandler } from './examples/UserCreatedEventHandler'

describe('eventBus', () => {
  let eventBus: EventBus
  let eventStore: EventStore
  let handler: UserCreatedEventHandler
  let aggregateId: string
  let payload: UserCreatedEventProps

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    handler = new UserCreatedEventHandler(eventStore)
    aggregateId = '123'
    payload = { name: 'test', email: 'musk@x.com' }
  })

  it('should be defined', () => {
    expect(EventBus).toBeDefined()
  })

  it('should be able subscribe to events', () => {
    eventBus.subscribe(handler)
  })

  it('should be able publish events', async () => {
    eventBus.subscribe(handler)
    const createdEvent = new UserCreatedEvent(aggregateId, payload)
    await eventBus.publish(createdEvent)

    const events = await eventStore.loadEvents(aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata?.causationId === createdEvent.metadata?.eventId)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex]).toBeInstanceOf(UserRegistrationEmailSentEvent)
  })
})
