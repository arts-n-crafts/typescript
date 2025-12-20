import type { BaseMetadata } from '@core/types/BaseMetadata.ts'
import type { ISODateTime } from '@core/types/ISODateTime.ts'
import type { WithIdentifier } from './types/WithIdentifier.ts'

export interface CommandMetadata extends BaseMetadata {
}

export interface Command<TType = string, TPayload = unknown> extends WithIdentifier {
  /** Unique command id. */
  id: string
  /** Command type, e.g., "CreateOrder". */
  type: TType
  /** Target aggregate type (optional; may be inferred). */
  aggregateType?: string
  /** Target aggregate id (optional for create commands). */
  aggregateId?: string
  /** Business intent payload. */
  payload: TPayload
  /** When the command was issued. */
  timestamp: ISODateTime
  /** Expected aggregate version for optimistic concurrency. */
  expectedVersion?: number
  /** Optional metadata. */
  metadata?: Partial<CommandMetadata>
  /** Discriminator for the message intent. */
  kind: 'command'
}
