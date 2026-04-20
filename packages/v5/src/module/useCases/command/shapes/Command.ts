import type { Metadata } from 'src/module/core/shapes/Metadata.ts'
import type { WithIdentifier } from 'src/module/core/shapes/WithIdentifier.ts'

export interface Command<TType = string, TPayload = unknown> extends WithIdentifier {
  /** Command type, e.g., "CreateOrder". */
  type: TType
  /** Target aggregate type (optional; may be inferred). */
  aggregateType?: string
  /** Target aggregate id (optional for create commands). */
  aggregateId?: string
  /** Business intent payload. */
  payload: TPayload
  /**
   * Event time in epoch milliseconds (internal consistency for ES and sorting).
   */
  timestamp: number
  /** Expected aggregate version for optimistic concurrency. */
  expectedVersion?: number
  /** Metadata. */
  metadata: Metadata
  /** Discriminator for the message intent. */
  kind: 'command'
}
