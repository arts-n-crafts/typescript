import type { BaseMetadata } from '@core/types/BaseMetadata.ts'
import type { ISODateTime } from '@core/types/ISODateTime.ts'

/**
 * Integration events are the wire contract you publish externally (Kafka, audit,
 * New Relic). The same envelope carries both accepted domain facts and rejected
 * decisions. Keep the schema stable and evolve with schemaVersion.
 */
export interface IntegrationEventMetadata extends BaseMetadata {
  /** Outcome of the decision. */
  outcome?: 'accepted' | 'rejected'

  /** Correlation and routing fields. */
  aggregateType?: string
  aggregateId?: string
  commandType?: string
  commandId?: string
  expectedVersion?: number
  currentVersion?: number
}

export interface IntegrationEvent<TPayload = unknown> {
  /** Stable id for idempotency. */
  id: string
  /** Event type, e.g., "OrderCreated" or "CreateOrderRejected". */
  type: string
  /** Event payload. For rejections include reasonCode and related info. */
  payload: TPayload
  /** ISO timestamp (external consistency). */
  timestamp: ISODateTime
  /** Standardized, extensible metadata. */
  metadata: Partial<IntegrationEventMetadata>
  /** Discriminator for the message intent. */
  kind: 'integration'
}
