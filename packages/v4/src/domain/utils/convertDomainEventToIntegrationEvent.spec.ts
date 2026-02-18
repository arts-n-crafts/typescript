import type { DomainEvent } from '@domain/DomainEvent.ts'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { convertDomainEventToIntegrationEvent } from './convertDomainEventToIntegrationEvent.ts'

describe('convertDomainEventToIntegrationEvent', () => {
  const domainEvent: DomainEvent<{ name: string }> = {
    id: randomUUID(),
    type: 'UserCreated',
    aggregateType: 'User',
    aggregateId: randomUUID(),
    payload: { name: 'Elon' },
    timestamp: Date.now(),
    metadata: {},
    kind: 'domain',
  }

  it('should produce an integration event with kind integration', () => {
    const result = convertDomainEventToIntegrationEvent(domainEvent)
    expect(result.kind).toBe('integration')
  })

  it('should carry the same type as the domain event', () => {
    const result = convertDomainEventToIntegrationEvent(domainEvent)
    expect(result.type).toBe(domainEvent.type)
  })

  it('should carry the same payload as the domain event', () => {
    const result = convertDomainEventToIntegrationEvent(domainEvent)
    expect(result.payload).toEqual(domainEvent.payload)
  })

  it('should set outcome to accepted', () => {
    const result = convertDomainEventToIntegrationEvent(domainEvent)
    expect(result.metadata.outcome).toBe('accepted')
  })

  it('should carry aggregateType and aggregateId in metadata', () => {
    const result = convertDomainEventToIntegrationEvent(domainEvent)
    expect(result.metadata.aggregateType).toBe(domainEvent.aggregateType)
    expect(result.metadata.aggregateId).toBe(domainEvent.aggregateId)
  })
})
