export interface Metadata {
  /** Correlates a flow across services (end-to-end). */
  correlationId: string;
  /** Points to the immediate cause (often previous message id). */
  causationId: string;
  /** Tenant identifier for multi-tenant systems. */
  tenantId?: string;
  /** Actor or user responsible for the change. */
  userId?: string;

  /** Room for additive extensions. */
  [key: string]: unknown;
}
