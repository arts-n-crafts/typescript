export interface CommandMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface Command<TType extends string, TPayload> {
  type: TType
  aggregateId: string
  payload: TPayload
  metadata: {
    timestamp: string
    kind: 'command'
  } & CommandMetadata
}
