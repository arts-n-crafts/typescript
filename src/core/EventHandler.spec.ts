import type { DomainEvent } from '../domain'
import type { UserEvent } from '../domain/examples/User.ts'
import type { UserCreatedPayload } from '../domain/examples/UserCreated.ts'
import type { UserRegistrationEmailSentPayload } from '../domain/examples/UserRegistrationEmailSent.ts'
import type { EventStore } from '../infrastructure'
import { UserCreated } from '../domain/examples/UserCreated.ts'
import { ContractSignedHandler } from './examples/ContractSignedHandler.ts'
import { UserCreatedEventHandler } from './examples/UserCreatedEventHandler.ts'

describe('eventHandler', () => {
  let events: UserEvent[] = []
  const eventStore: EventStore<UserEvent> = {
    async loadEvents() {
      return events
    },
    async store(event: UserEvent) {
      events = [...events, event]
    },
  }
  let handler: UserCreatedEventHandler
  let aggregateId: string
  let payload: UserCreatedPayload

  beforeEach(() => {
    handler = new UserCreatedEventHandler(eventStore)
    aggregateId = '123'
    payload = { name: 'test', email: 'musk@x.com', prospect: true }
  })

  it('should be defined', () => {
    expect(ContractSignedHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = UserCreated(aggregateId, payload)
    await handler.handle(event)
    const events = await eventStore.loadEvents(aggregateId)
    const sentEvent = events[0] as unknown as DomainEvent<UserRegistrationEmailSentPayload>
    expect(sentEvent.type).toBe('UserRegistrationEmailSent')
    expect(sentEvent.payload.status).toBe('SUCCESS')
  })
})
