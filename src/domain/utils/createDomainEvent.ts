import type { DomainEvent, DomainEventMetadata } from '../DomainEvent'
import { randomUUID } from 'node:crypto'

export function createDomainEvent<T>(type: string, aggregateId: string, payload: T, metadata?: Partial<DomainEventMetadata>): DomainEvent<T> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateId,
    payload,
    source: 'internal',
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })
}
