import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { UserCreatedPayload } from '../../domain/DomainEvent/examples/UserCreated'
import type { UserRegistrationEmailSentPayload } from '../../domain/DomainEvent/examples/UserRegistrationEmailSent'
import type { IEventStore } from '../EventStore/IEventStore'
import { UserCreated } from '../../domain/DomainEvent/examples/UserCreated'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { EventBus } from './EventBus'
import { ContractSignedHandler } from './examples/ContractSignedHandler'
import { UserCreatedEventHandler } from './examples/UserCreatedEventHandler'

describe('eventHandler', () => {
  let eventBus: EventBus
  let eventStore: IEventStore
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
    expect(ContractSignedHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = UserCreated(aggregateId, 1, payload)
    await handler.handle(event)
    const events = await eventStore.loadEvents(aggregateId)
    const sentEvent = events[0] as DomainEvent<UserRegistrationEmailSentPayload>
    expect(sentEvent.type).toBe('UserRegistrationEmailSent')
    expect(sentEvent.payload.status).toBe('SUCCESS')
  })
})
