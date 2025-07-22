export interface CommandMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface Command<TType = string, TPayload = unknown> {
  type: TType
  aggregateId: string
  payload: TPayload
  kind: 'command'
  timestamp: string
  metadata: Partial<CommandMetadata>
}
