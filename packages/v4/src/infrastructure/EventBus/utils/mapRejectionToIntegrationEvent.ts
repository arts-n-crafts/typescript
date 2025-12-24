import type { Rejection } from '@domain/Rejection.ts'
import type { IntegrationEvent, IntegrationEventMetadata } from '@infrastructure/EventBus/IntegrationEvent.ts'

export function mapRejectionToIntegrationEvent<TDetails>(
  rejection: Rejection<TDetails>,
): IntegrationEvent<{
  reasonCode: Rejection<TDetails>['reasonCode']
  reason?: string
  classification?: Rejection<TDetails>['classification']
  retryable?: boolean
  details?: TDetails
  validationErrors?: Rejection<TDetails>['validationErrors']
}> {
  const metadata: Partial<IntegrationEventMetadata> = {
    ...rejection.metadata,
    outcome: 'rejected',
    commandId: rejection.commandId,
    commandType: rejection.commandType,
  }

  return {
    id: rejection.id,
    type: rejection.type,
    payload: {
      reasonCode: rejection.reasonCode,
      reason: rejection.reason,
      classification: rejection.classification,
      retryable: rejection.retryable,
      details: rejection.details,
      validationErrors: rejection.validationErrors,
    },
    timestamp: new Date(rejection.timestamp).toISOString(),
    metadata,
    kind: 'integration',
  }
}
