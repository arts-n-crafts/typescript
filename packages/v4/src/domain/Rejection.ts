import type { BaseMetadata } from '@core/types/BaseMetadata.ts'

/**
 * Rejection models a failed command decision. It is NOT part of the aggregate
 * event stream. Persist via an outbox/inbox if you need durability and emit an
 * IntegrationEvent with outcome="rejected" for external consumers.
 */
export interface RejectionMetadata extends BaseMetadata {
}

export interface Rejection<TDetails = unknown> {
  /** Unique id; derive from commandId if possible for dedupe. */
  id: string
  /** Rejection type, format e.g., "{commandType}Rejected", "{commandType}Failed". Example "CreateUserRejected" */
  type: string
  /** Discriminator for the message intent. */
  kind: 'rejection'
  /** Aggregate type when known (for correlation). */
  aggregateType?: string
  /** Aggregate id when known (for correlation/partitioning). */
  aggregateId?: string

  /** The command that was rejected. */
  commandId: string
  /** The command type, e.g., "CreateOrder". */
  commandType: string

  /** Short machine-readable code, e.g., "VERSION_CONFLICT", "VALIDATION_FAILED". */
  reasonCode: string | 'VERSION_CONFLICT' | 'VALIDATION_FAILED'
  /** Human-readable summary (avoid PII if externalized). */
  reason?: string
  /** Classification for routing/metrics. */
  classification?: 'business' | 'validation' | 'concurrency' | 'technical'
  /** Hint to infra/ops whether retry makes sense. */
  retryable?: boolean
  /** Structured details specific to this rejection. */
  details?: TDetails
  /**
   * Only for VALIDATION_FAILED: list of field-level errors.
   */
  validationErrors?: Array<{
    field?: string
    code: string
    message?: string
  }>
  /** ISO timestamp for external consistency. */
  timestamp: number

  /** Optional metadata (trace/correlation/tenant). */
  metadata?: RejectionMetadata
}
