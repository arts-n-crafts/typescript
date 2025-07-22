export interface QueryMetadata {
  [key: string]: unknown
}

export interface Query<TType = string, TPayload = unknown> {
  type: TType
  payload: TPayload
  kind: 'query'
  timestamp: string
  metadata: Partial<QueryMetadata>
}
