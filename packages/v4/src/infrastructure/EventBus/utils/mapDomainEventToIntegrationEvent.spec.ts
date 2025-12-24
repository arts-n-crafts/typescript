import type { DomainEventMetadata } from '@domain/DomainEvent.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { mapDomainEventToIntegrationEvent } from '@infrastructure/EventBus/utils/mapDomainEventToIntegrationEvent.ts'

describe('domainEvent to integration event', () => {
  let aggregateId: string
  let metadata: DomainEventMetadata

  beforeEach(() => {
    aggregateId = randomUUID()
    metadata = {}
  })

  it('should be defined', () => {
    expect(mapDomainEventToIntegrationEvent).toBeDefined()
  })

  it('should convert the UserCreated event', () => {
    const payload: UserCreatedPayload = {
      name: 'Elon',
      email: 'musk@x.com',
      age: 52,
      prospect: true,
    }
    const domainEvent = createUserCreatedEvent(aggregateId, payload, metadata)
    const integrationEvent = mapDomainEventToIntegrationEvent(domainEvent)

    expect(integrationEvent.id).toBe(domainEvent.id)
    expect(integrationEvent.type).toBe(domainEvent.type)
    expect(integrationEvent.payload).toStrictEqual(payload)
    expect(integrationEvent.metadata.aggregateId).toBe(aggregateId)
    expect(integrationEvent.metadata.aggregateType).toBe('User')
    expect(integrationEvent.metadata.outcome).toBe('accepted')
  })
})
