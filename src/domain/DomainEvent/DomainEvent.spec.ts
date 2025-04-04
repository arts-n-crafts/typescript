import type { DomainEventMetadata } from './DomainEvent'
import type { UserCreatedPayload } from './examples/UserCreated'
import type { UserNameUpdatedPayload } from './examples/UserNameUpdated'
import type { UserRegistrationEmailSentPayload } from './examples/UserRegistrationEmailSent'
import { randomUUID } from 'node:crypto'
import { createDomainEvent } from './createDomainEvent'
import { UserCreated } from './examples/UserCreated'
import { UserNameUpdated } from './examples/UserNameUpdated'
import { UserRegistrationEmailSent } from './examples/UserRegistrationEmailSent'

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

  it('should create the UserCreated event', () => {
    const payload: UserCreatedPayload = {
      name: 'Elon',
      email: 'musk@x.com',
      age: 52,
    }
    const event = UserCreated(aggregateId, payload, metadata)
    expect(event.type).toBe('UserCreated')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event.metadata).toHaveProperty('eventId')
    expect(event.metadata).toHaveProperty('timestamp')
    expect(event.version).toBe(1)
  })

  it('should create the UserNameUpdated event', () => {
    const payload: UserNameUpdatedPayload = { name: '' }
    const event = UserNameUpdated(aggregateId, payload, metadata)
    expect(event.type).toBe('UserNameUpdated')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event.version).toBe(2)
    expect(event.metadata).toHaveProperty('eventId')
    expect(event.metadata).toHaveProperty('timestamp')
  })

  it('should create the UserRegistrationEmailSent event', () => {
    const payload: UserRegistrationEmailSentPayload = { status: 'SUCCESS' }
    const event = UserRegistrationEmailSent(aggregateId, payload, metadata)
    expect(event.type).toBe('UserRegistrationEmailSent')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event.version).toBe(1)
    expect(event.metadata).toHaveProperty('eventId')
    expect(event.metadata).toHaveProperty('timestamp')
  })
})
