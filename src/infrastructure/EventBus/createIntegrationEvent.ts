import type { IntegrationEvent, IntegrationEventMetadata } from './IntegrationEvent'
import { randomUUID } from 'node:crypto'

export function createIntegrationEvent<T>(type: string, payload: T, metadata?: Partial<IntegrationEventMetadata>, version: number = 1): IntegrationEvent<T> {
  return Object.freeze({
    type,
    payload,
    metadata: {
      eventId: randomUUID(),
      ...metadata,
      timestamp: new Date().toISOString(),
    },
    version,
  })
}
