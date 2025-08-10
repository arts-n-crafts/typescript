import type { DomainEventMetadata } from './DomainEvent.ts'
import type { UserCreatedPayload } from './examples/UserCreated.ts'
import type { UserNameUpdatedPayload } from './examples/UserNameUpdated.ts'
import type { UserRegistrationEmailSentPayload } from './examples/UserRegistrationEmailSent.ts'
import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from './examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from './examples/UserNameUpdated.ts'
import { UserRegistrationEmailSent } from './examples/UserRegistrationEmailSent.ts'
import { createDomainEvent } from './utils/createDomainEvent.ts'
import { isDomainEvent } from './utils/isDomainEvent.ts'

describe('domainEvent', () => {
  let aggregateId: string
  let metadata: DomainEventMetadata

  beforeEach(() => {
    aggregateId = randomUUID()
    metadata = {}
  })

  it('should be defined', () => {
    expect(createDomainEvent).toBeDefined()
  })

  it('should consider the event as a domainEvent', () => {
    const payload: UserNameUpdatedPayload = { name: '' }
    const event = createUserNameUpdatedEvent(aggregateId, payload, metadata)
    expect(isDomainEvent(event)).toBeTruthy()
  })

  it('should create the UserCreated event', () => {
    const payload: UserCreatedPayload = {
      name: 'Elon',
      email: 'musk@x.com',
      age: 52,
      prospect: true,
    }
    const event = createUserCreatedEvent(aggregateId, payload, metadata)
    expect(event.type).toBe('UserCreated')
    expect(event.id).toBeDefined()
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toStrictEqual(payload)
    expect(event).toHaveProperty('timestamp')
  })

  it('should create the UserNameUpdated event', () => {
    const payload: UserNameUpdatedPayload = { name: '' }
    const event = createUserNameUpdatedEvent(aggregateId, payload, metadata)
    expect(event.id).toBeDefined()
    expect(event.type).toBe('UserNameUpdated')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event).toHaveProperty('timestamp')
  })

  it('should create the UserRegistrationEmailSent event', () => {
    const payload: UserRegistrationEmailSentPayload = { status: 'SUCCESS' }
    const event = UserRegistrationEmailSent(aggregateId, payload, metadata)
    expect(event.id).toBeDefined()
    expect(event.type).toBe('UserRegistrationEmailSent')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event).toHaveProperty('timestamp')
  })
})
