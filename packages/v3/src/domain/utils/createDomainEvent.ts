import type { DomainEvent, DomainEventMetadata } from '@domain/DomainEvent.ts'
import { randomUUID } from 'node:crypto'

export function createDomainEvent<TPayload = unknown>(
  type: string,
  aggregateId: string,
  payload: TPayload,
  metadata: Partial<DomainEventMetadata> = {},
): DomainEvent<TPayload> {
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
