import type { Metadata } from 'src/module/core/shapes/Metadata.ts'
import type { WithIdentifier } from 'src/module/core/shapes/WithIdentifier.ts'

export interface Query<TType = string, TPayload = unknown> extends WithIdentifier {
  /** Query type, e.g., "ListOrders". */
  type: TType
  /** Business intent payload. */
  payload: TPayload
  /**
   * Event time in epoch milliseconds (internal consistency for ES and sorting).
   */
  timestamp: number
  /** Metadata. */
  metadata: Metadata
  /** Discriminator for the message intent. */
  kind: 'query'
}
