import type { UUID } from 'node:crypto'
import type { EventMetadataProps } from '../../infrastructure/EventBus/Event'
import type { SubscriptionAddedEventProps } from './examples/SubscriptionAddedEvent'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { Event } from './Event'
import { SubscriptionAddedEvent } from './examples/SubscriptionAddedEvent'

describe('domainEvent', () => {
  let userId: UUID
  let subscriptionId: UUID
  let payload: SubscriptionAddedEventProps
  let metadata: EventMetadataProps

  beforeEach(() => {
    userId = randomUUID()
    subscriptionId = randomUUID()
    payload = { userId, subscriptionId }
    metadata = { causationId: '321' }
  })

  it('should be defined', () => {
    expect(Event).toBeDefined()
  })

  it('should create an instance', () => {
    const event = new SubscriptionAddedEvent(payload)
    event.applyMetadata(metadata)
    expect(event).toBeInstanceOf(SubscriptionAddedEvent)
  })

  it('should contain the valid information', () => {
    const event = new SubscriptionAddedEvent(payload)
    event.applyMetadata(metadata)
    expect(event.payload.userId).toBe(userId)
    expect(event.payload.subscriptionId).toBe(subscriptionId)
    expect(event.metadata?.causationId).toBe('321')
  })

  it('should have a type', () => {
    const event = new SubscriptionAddedEvent(payload)
    expect(event.type).toBe('event')
  })
})
