export interface BaseEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface BaseEvent<TPayload = object> {
  id: string
  type: string
  payload: TPayload
  metadata: {
    timestamp: string
    source: 'internal' | 'external'
  } & Partial<BaseEventMetadata>
}
