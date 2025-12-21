export interface IntegrationEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface IntegrationEvent<TPayload = unknown> {
  id: string
  type: string
  source: 'external'
  payload: TPayload
  timestamp: string
  metadata: {
  } & Partial<IntegrationEventMetadata>
}
