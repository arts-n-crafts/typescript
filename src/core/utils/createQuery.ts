import type { Query, QueryMetadata } from '@core/Query.ts'
import { randomUUID } from 'node:crypto'

export function createQuery<TPayload>(type: string, payload: TPayload, metadata?: Partial<QueryMetadata>): Query<TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    kind: 'query',
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  })
}
