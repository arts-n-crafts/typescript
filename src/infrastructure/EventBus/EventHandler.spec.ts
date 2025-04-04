import type { UserCreatedEventProps } from '../../domain/DomainEvent_v1/examples/UserCreated'
import type { EventStore } from '../EventStore/EventStore'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserCreatedEvent } from '../../domain/DomainEvent_v1/examples/UserCreated'
import { UserRegistrationEmailSentEvent } from '../../domain/DomainEvent_v1/examples/UserRegistrationEmailSent'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { EventBus } from './EventBus'
import { EventHandler } from './EventHandler'
import { UserCreatedEventHandler } from './examples/UserCreatedEventHandler'

describe('eventHandler', () => {
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
    expect(EventHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = new UserCreatedEvent(aggregateId, payload)
    await handler.handle(event)
    const events = await eventStore.loadEvents(aggregateId)
    const sentEvent = events[0] as UserRegistrationEmailSentEvent
    expect(sentEvent).toBeInstanceOf(UserRegistrationEmailSentEvent)
    expect(sentEvent.payload?.status).toBe('SUCCESS')
  })
})
