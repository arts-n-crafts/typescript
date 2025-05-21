import type { DomainEvent, DomainEventMetadata } from '../DomainEvent'
import { randomUUID } from 'node:crypto'

export function createDomainEvent<T>(type: string, aggregateId: string, sequenceNumber: number, payload: T, metadata?: Partial<DomainEventMetadata>): DomainEvent<T> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateId,
    sequenceNumber,
    payload,
    metadata: {
      ...metadata,
      source: 'internal',
      timestamp: new Date().toISOString(),
    },
  })
}
