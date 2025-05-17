export interface QueryMetadata {
  [key: string]: unknown
}

export interface Query<TPayload = unknown> {
  version: number
  type: string
  payload: TPayload
  metadata: {
    timestamp: string
    kind: 'query'
  } & QueryMetadata
}
