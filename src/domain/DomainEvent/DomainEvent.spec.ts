import type { DomainEventMetadataProps } from './DomainEvent'
import type { UserNameUpdatedEventProps } from './examples/UserNameUpdated'
import { beforeEach, describe, expect, it } from 'vitest'
import { DomainEvent } from './DomainEvent'
import { UserNameUpdatedEvent } from './examples/UserNameUpdated'

describe('domainEvent', () => {
  let aggregateId: string
  let payload: UserNameUpdatedEventProps
  let metadata: DomainEventMetadataProps

  beforeEach(() => {
    aggregateId = '123'
    payload = { name: 'test' }
    metadata = { causationId: '321' }
  })

  it('should be defined', () => {
    expect(DomainEvent).toBeDefined()
  })

  it('should create an instance', () => {
    const event = new UserNameUpdatedEvent(aggregateId, payload)
    event.applyMetadata(metadata)
    expect(event).toBeInstanceOf(UserNameUpdatedEvent)
  })

  it('should contain the valid information', () => {
    const event = new UserNameUpdatedEvent(aggregateId, payload)
    event.applyMetadata(metadata)
    expect(event.payload.name).toBe('test')
    expect(event.metadata?.causationId).toBe('321')
  })

  it('should have a type', () => {
    const event = new UserNameUpdatedEvent(aggregateId, payload)
    expect(event.type).toBe('event')
  })
})
