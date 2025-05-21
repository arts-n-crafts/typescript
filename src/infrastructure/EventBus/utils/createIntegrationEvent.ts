import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent'
import { randomUUID } from 'node:crypto'

export function createIntegrationEvent<T>(type: string, payload: T, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<T> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    metadata: {
      ...metadata,
      source: 'external',
      timestamp: new Date().toISOString(),
    },
  })
}
