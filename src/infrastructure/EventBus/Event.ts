export interface BaseEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface BaseEvent<T = unknown> {
  version: number
  id: string
  type: string
  payload: T
  metadata: {
    timestamp: string
    source: 'internal' | 'external'
  } & Partial<BaseEventMetadata>
}
