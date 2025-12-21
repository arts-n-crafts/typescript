export interface BaseMetadata {
  /** Correlates a flow across services (end-to-end). */
  correlationId?: string
  /** Points to the immediate cause (often previous message id). */
  causationId?: string
  /** Trace identifier for distributed tracing. */
  traceId?: string
  /** Schema version of this event's metadata/payload. */
  schemaVersion?: number
  /** Tenant identifier for multi-tenant systems. */
  tenantId?: string
  /** Actor or user responsible for the change. */
  userId?: string
  /** Marker: domain events originate internally. */
  /**
   * Producer identifier. Prefer your service name, e.g., "orders-service".
   */
  source?: string

  /** Room for additive extensions. */
  [key: string]: unknown
}
