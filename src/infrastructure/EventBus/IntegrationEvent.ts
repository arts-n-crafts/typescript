export interface IntegrationEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

/**
 * IntegrationEvent represents an event coming from an external source.
 *
 * To create IntegrationEvents, use the helper functions:
 * - createIntegrationEvent()
 *
 * To check if a value is an IntegrationEvent, use the helper function:
 * - isIntegrationEvent()
 *
 * These helpers ensure correct typing, structure, and metadata assignment.
 */
export interface IntegrationEvent<TPayload> {
  id: string
  type: string
  source: 'external'
  payload: TPayload
  timestamp: string
  metadata: {
  } & Partial<IntegrationEventMetadata>
}
