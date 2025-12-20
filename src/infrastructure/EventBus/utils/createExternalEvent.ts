import type { ExternalEvent, ExternalEventMetadata } from '../ExternalEvent.ts'
import { randomUUID } from 'node:crypto'

export function createExternalEvent<TPayload = unknown>(type: string, payload: TPayload, metadata?: Partial<ExternalEventMetadata>): ExternalEvent<TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    timestamp: new Date().toISOString(),
    metadata: {
      ...metadata,
    },
    kind: 'external',
  })
}
