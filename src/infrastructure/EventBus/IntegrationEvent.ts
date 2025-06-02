import type { BaseEvent, BaseEventMetadata } from './BaseEvent'

export interface IntegrationEventMetadata
  extends BaseEventMetadata { }

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
export interface IntegrationEvent<T = object>
  extends Omit<BaseEvent<T>, 'metadata'> {
  metadata: {
    source: 'external'
    timestamp: string
  } & Partial<IntegrationEventMetadata>
}
