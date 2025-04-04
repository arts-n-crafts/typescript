export interface IntegrationEventMetadata {
  eventId?: string
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface IntegrationEvent<T = unknown> {
  type: string
  payload: T
  metadata: {
    timestamp: string
    eventId: string
  } & Partial<IntegrationEventMetadata>
}
