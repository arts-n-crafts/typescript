import type { BaseMetadata } from '@core/types/BaseMetadata.ts'
/**
 * Domain events are internal, immutable, state-changing facts appended to the
 * aggregate event stream (event sourcing). They do not leave the bounded
 * context directly; map them to IntegrationEvents when publishing externally.
 */

export interface DomainEventMetadata extends BaseMetadata {
}

export interface DomainEvent<TPayload = unknown> {
  /** Unique id for this domain event. */
  id: string
  /** Event type, e.g., "OrderCreated". */
  type: string
  /** Aggregate type, e.g., "Order". */
  aggregateType: string
  /** Aggregate id. */
  aggregateId: string
  /** Event payload (state change details). */
  payload: TPayload
  /**
   * Event time in epoch milliseconds (internal consistency for ES and sorting).
   * Prefer number internally; convert to ISO for outbound messages.
   */
  timestamp: number
  /** Optional metadata; keep it small and stable. */
  metadata: Partial<DomainEventMetadata>
  /** Discriminator for the message intent. */
  kind: 'domain'
}
