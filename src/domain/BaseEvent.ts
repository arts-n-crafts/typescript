export interface BaseEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface BaseEvent<TPayload = object> {
  id: string
  type: string
  payload: TPayload
  source: 'internal' | 'external'
  metadata: {
    timestamp: string
  } & Partial<BaseEventMetadata>
}
