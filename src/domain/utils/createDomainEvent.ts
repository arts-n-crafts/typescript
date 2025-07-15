import type { DomainEvent, DomainEventMetadata } from '@domain/DomainEvent.ts'
import { randomUUID } from 'node:crypto'

export function createDomainEvent<T>(type: string, aggregateId: string, payload: T, metadata: Partial<DomainEventMetadata> = {}): DomainEvent<T> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateId,
    payload,
    source: 'internal',
    timestamp: new Date().toISOString(),
    metadata,
  })
}
