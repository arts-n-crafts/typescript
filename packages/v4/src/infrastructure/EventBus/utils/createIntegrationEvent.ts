import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { randomUUID } from 'node:crypto'

export function createIntegrationEvent<TPayload = unknown>(type: string, payload: TPayload, metadata: Partial<IntegrationEventMetadata> = {}, timestamp = new Date().toISOString()): IntegrationEvent<TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    timestamp,
    metadata: {
      ...metadata,
    },
    kind: 'integration',
  })
}
