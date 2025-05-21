import type { BaseEvent, BaseEventMetadata } from '../../infrastructure/EventBus/BaseEvent'

export interface DomainEventMetadata
  extends BaseEventMetadata { }

/**
 * DomainEvent represents an event coming from an external source.
 *
 * To create DomainEvents, use the helper functions:
 * - createDomainEvent()
 *
 * To check if a value is an DomainEvent, use the helper function:
 * - isDomainEvent()
 *
 * These helpers ensure correct typing, structure, and metadata assignment.
 */
export interface DomainEvent<T = unknown>
  extends Omit<BaseEvent<T>, 'metadata'> {
  aggregateId: string
  sequenceNumber: number
  metadata: {
    source: 'internal'
    timestamp: string
  } & Partial<DomainEventMetadata>
}
