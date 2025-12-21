import type { WithIdentifier } from './types/WithIdentifier.ts'

export interface QueryMetadata {
  [key: string]: unknown
}

export interface Query<TType = string, TPayload = unknown> extends WithIdentifier {
  type: TType
  payload: TPayload
  kind: 'query'
  timestamp: number
  metadata: Partial<QueryMetadata>
}
