import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent'
import { randomUUID } from 'node:crypto'

export function createIntegrationEvent<TPayload>(type: string, payload: TPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<TPayload> {
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
