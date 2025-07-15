export interface QueryMetadata {
  [key: string]: unknown
}

export interface Query<TPayload = object> {
  type: string
  payload: TPayload
  kind: 'query'
  timestamp: string
  metadata: Partial<QueryMetadata>
}
