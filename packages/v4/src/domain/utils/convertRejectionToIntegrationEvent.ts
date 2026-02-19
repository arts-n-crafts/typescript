import type { Rejection } from '@domain/Rejection.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { createIntegrationEvent } from '@infrastructure/EventBus/utils/createIntegrationEvent.ts'

export function convertRejectionToIntegrationEvent(rejection: Rejection): IntegrationEvent {
  return createIntegrationEvent(
    rejection.commandType,
    { ...rejection.details, reasonCode: rejection.reasonCode },
    {
      outcome: 'rejected',
      aggregateType: rejection.metadata?.aggregateType,
      aggregateId: rejection.metadata?.aggregateId,
      commandType: rejection.commandType,
      commandId: rejection.commandId,
    },
    new Date(rejection.timestamp).toISOString(),
  )
}
