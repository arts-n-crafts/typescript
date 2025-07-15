import type { Query, QueryMetadata } from '@core/Query.ts'
import { randomUUID } from 'node:crypto'

export function createQuery<TPayload>(type: string, payload: TPayload, metadata: QueryMetadata = {}): Query<TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    kind: 'query',
    timestamp: new Date().toISOString(),
    metadata,
  })
}
