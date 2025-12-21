import type { Query, QueryMetadata } from '@core/Query.ts'
import { randomUUID } from 'node:crypto'

export function createQuery<TType extends string, TPayload>(type: TType, payload: TPayload, metadata: QueryMetadata = {}): Query<TType, TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    payload,
    kind: 'query',
    timestamp: Math.floor(new Date().getTime() / 1000),
    metadata,
  })
}
