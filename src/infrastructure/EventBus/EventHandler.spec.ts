import type { MockUserCreatedEventProps } from '../../domain/DomainEvent/mocks/MockUserCreated'
import type { EventStore } from '../EventStore/EventStore'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockUserCreatedEvent } from '../../domain/DomainEvent/mocks/MockUserCreated'
import { MockUserRegistrationEmailSentEvent } from '../../domain/DomainEvent/mocks/MockUserRegistrationEmailSent'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { EventBus } from './EventBus'
import { EventHandler } from './EventHandler'
import { MockUserCreatedEventHandler } from './mocks/MockUserCreatedEventHandler'

describe('eventHandler', () => {
  let eventBus: EventBus
  let eventStore: EventStore
  let handler: MockUserCreatedEventHandler
  let aggregateId: string
  let payload: MockUserCreatedEventProps

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    handler = new MockUserCreatedEventHandler(eventStore)
    aggregateId = '123'
    payload = { name: 'test', email: 'musk@x.com' }
  })

  it('should be defined', () => {
    expect(EventHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = new MockUserCreatedEvent(aggregateId, payload)
    await handler.handle(event)
    const events = await eventStore.loadEvents(aggregateId)
    const sentEvent = events[0] as MockUserRegistrationEmailSentEvent
    expect(sentEvent).toBeInstanceOf(MockUserRegistrationEmailSentEvent)
    expect(sentEvent.payload?.status).toBe('SUCCESS')
  })
})
