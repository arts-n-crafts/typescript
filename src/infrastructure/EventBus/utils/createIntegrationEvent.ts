import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent'
import { randomUUID } from 'node:crypto'

export function createIntegrationEvent<TPayload>(type: string, payload: TPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    source: 'external',
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })
}
