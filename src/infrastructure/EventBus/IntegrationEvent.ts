export interface IntegrationEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface IntegrationEvent<T = unknown> {
  id: string
  type: string
  payload: T
  metadata: {
    timestamp: string
  } & Partial<IntegrationEventMetadata>
  version: number
}
