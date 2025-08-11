import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { randomUUID } from 'node:crypto'

export function createIntegrationEvent<TPayload = unknown>(type: string, payload: TPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    source: 'external',
    timestamp: new Date().toISOString(),
    metadata: {
      ...metadata,
    },
  })
}
