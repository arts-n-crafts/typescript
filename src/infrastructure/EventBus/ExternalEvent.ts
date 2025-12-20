import type { BaseMetadata } from '@core/types/BaseMetadata.ts'
import type { ISODateTime } from '@core/types/ISODateTime.ts'

/**
 * ExternalEvent is a fact emitted by another bounded context or third-party.
 * Your service treats it as an immutable notification and may react to it
 * (e.g., drive a saga or translate it into an internal Command).
 */
export interface ExternalEventMetadata extends BaseMetadata {
}

export interface ExternalEvent<TPayload = unknown> {
  /** Producer-assigned id (treat as opaque). */
  id: string
  /** External type, e.g., "PaymentSettled". */
  type: string
  /** Event payload as produced by the external system. */
  payload: TPayload
  /** ISO timestamp from the producer. */
  timestamp: ISODateTime
  /** Optional metadata from the producer. */
  metadata?: Partial<ExternalEventMetadata>
  /** Discriminator for the message intent. */
  kind: 'external'
}
