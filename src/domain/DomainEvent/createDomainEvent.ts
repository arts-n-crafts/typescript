import type { DomainEvent, DomainEventMetadata } from './DomainEvent'
import { randomUUID } from 'node:crypto'

export function createDomainEvent<T>(type: string, aggregateId: string, payload: T, metadata?: Partial<DomainEventMetadata>, version: number = 1): DomainEvent<T> {
  return Object.freeze({
    type,
    aggregateId,
    payload,
    metadata: {
      eventId: randomUUID(),
      ...metadata,
      timestamp: new Date().toISOString(),
    },
    version,
  })
}
