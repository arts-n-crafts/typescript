import type { BaseMetadata } from '@core/types/BaseMetadata.ts'
import type { WithIdentifier } from './types/WithIdentifier.ts'

export interface QueryMetadata extends BaseMetadata {
}

export interface Query<TType = string, TPayload = unknown> extends WithIdentifier {
  type: TType
  payload: TPayload
  timestamp: string
  metadata: Partial<QueryMetadata>
  /** Discriminator for the message intent. */
  kind: 'query'
}
