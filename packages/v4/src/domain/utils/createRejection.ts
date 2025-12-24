import type { Rejection, RejectionMetadata } from '@domain/Rejection.ts'
import { randomUUID } from 'node:crypto'
import { getTimestamp } from '@core/utils/getTimestamp.ts'

export function createRejection<TDetails = unknown>(
  rejectionSpecifics: {
    commandId: Rejection['commandId']
    commandType: Rejection['commandType']
    reasonCode: Rejection['reasonCode']
    reason?: Rejection['reason']
    classification: Rejection['classification']
    retryable?: Rejection['retryable']
    validationErrors?: Rejection['validationErrors']
    type: 'Failed' | 'Rejected' | string
    details?: TDetails
  },
  metadata: Partial<RejectionMetadata> = {},
): Rejection<TDetails> {
  return Object.freeze({
    id: randomUUID(),
    commandId: rejectionSpecifics.commandId,
    commandType: rejectionSpecifics.commandType,
    reasonCode: rejectionSpecifics.reasonCode,
    reason: rejectionSpecifics.reason,
    classification: rejectionSpecifics.classification,
    retryable: rejectionSpecifics.retryable,
    validationErrors: rejectionSpecifics.validationErrors,
    type: `${rejectionSpecifics.commandType}${rejectionSpecifics.type}`,
    details: rejectionSpecifics.details,
    kind: 'rejection',
    timestamp: getTimestamp(),
    metadata,
  })
}
