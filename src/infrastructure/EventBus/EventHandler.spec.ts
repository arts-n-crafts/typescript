import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { UserCreatedPayload } from '../../domain/DomainEvent/examples/UserCreated'
import type { UserRegistrationEmailSentPayload } from '../../domain/DomainEvent/examples/UserRegistrationEmailSent'
import type { EventStore } from '../EventStore/EventStore'
import { UserCreated } from '../../domain/DomainEvent/examples/UserCreated'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { EventBus } from './EventBus'
import { EventHandler } from './EventHandler'
import { UserCreatedEventHandler } from './examples/UserCreatedEventHandler'

describe('eventHandler', () => {
  let eventBus: EventBus
  let eventStore: EventStore
  let handler: UserCreatedEventHandler
  let aggregateId: string
  let payload: UserCreatedPayload

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    handler = new UserCreatedEventHandler(eventStore)
    aggregateId = '123'
    payload = { name: 'test', email: 'musk@x.com', prospect: true }
  })

  it('should be defined', () => {
    expect(EventHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = UserCreated(aggregateId, payload)
    await handler.handle(event)
    const events = await eventStore.loadEvents(aggregateId)
    const sentEvent = events[0] as DomainEvent<UserRegistrationEmailSentPayload>
    expect(sentEvent.type).toBe('UserRegistrationEmailSent')
    expect(sentEvent.payload.status).toBe('SUCCESS')
  })
})
