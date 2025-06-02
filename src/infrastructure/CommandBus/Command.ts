export interface CommandMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface Command<TPayload = object> {
  type: string
  aggregateId: string
  payload: TPayload
  metadata: {
    timestamp: string
    kind: 'command'
  } & CommandMetadata
}
