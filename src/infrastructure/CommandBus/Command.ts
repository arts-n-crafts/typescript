export interface CommandMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface Command<TPayload, TId> {
  type: string
  aggregateId: TId
  payload: TPayload
  metadata: {
    timestamp: string
    kind: 'command'
  } & CommandMetadata
}
