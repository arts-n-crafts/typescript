import type { DomainEventMetadata } from './DomainEvent'
import type { UserCreatedPayload } from './examples/UserCreated'
import type { UserNameUpdatedPayload } from './examples/UserNameUpdated'
import type { UserRegistrationEmailSentPayload } from './examples/UserRegistrationEmailSent'
import { randomUUID } from 'node:crypto'
import { UserCreated } from './examples/UserCreated'
import { UserNameUpdated } from './examples/UserNameUpdated'
import { UserRegistrationEmailSent } from './examples/UserRegistrationEmailSent'
import { createDomainEvent } from './utils/createDomainEvent'
import { isDomainEvent } from './utils/isDomainEvent'

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
    const event = UserNameUpdated(aggregateId, payload, metadata)
    expect(isDomainEvent(event)).toBeTruthy()
  })

  it.each(['', [], null])('should not consider the event as a domainEvent', (input) => {
    expect(isDomainEvent(input)).toBeFalsy()
  })

  it('should create the UserCreated event', () => {
    const payload: UserCreatedPayload = {
      name: 'Elon',
      email: 'musk@x.com',
      age: 52,
    }
    const event = UserCreated(aggregateId, payload, metadata)
    expect(event.type).toBe('UserCreated')
    expect(event.id).toBeDefined()
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event.metadata).toHaveProperty('timestamp')
    expect(event.version).toBe(1)
  })

  it('should create the UserNameUpdated event', () => {
    const payload: UserNameUpdatedPayload = { name: '' }
    const event = UserNameUpdated(aggregateId, payload, metadata)
    expect(event.id).toBeDefined()
    expect(event.type).toBe('UserNameUpdated')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event.version).toBe(2)
    expect(event.metadata).toHaveProperty('timestamp')
  })

  it('should create the UserRegistrationEmailSent event', () => {
    const payload: UserRegistrationEmailSentPayload = { status: 'SUCCESS' }
    const event = UserRegistrationEmailSent(aggregateId, payload, metadata)
    expect(event.id).toBeDefined()
    expect(event.type).toBe('UserRegistrationEmailSent')
    expect(event.aggregateId).toBe(aggregateId)
    expect(event.payload).toBe(payload)
    expect(event.version).toBe(1)
    expect(event.metadata).toHaveProperty('timestamp')
  })
})
