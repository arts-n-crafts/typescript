import type { DomainEvent, DomainEventMetadata } from '../DomainEvent'
import { randomUUID } from 'node:crypto'

export function createDomainEvent<T>(type: string, aggregateId: string, payload: T, metadata?: Partial<DomainEventMetadata>, version: number = 1): DomainEvent<T> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateId,
    payload,
    metadata: {
      ...metadata,
      source: 'internal',
      timestamp: new Date().toISOString(),
    },
    version,
  })
}
