import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { createIntegrationEvent } from '@infrastructure/EventBus/utils/createIntegrationEvent.ts'

export function convertDomainEventToIntegrationEvent(event: DomainEvent): IntegrationEvent {
  return createIntegrationEvent(event.type, event.payload, {
    outcome: 'accepted',
    aggregateType: event.aggregateType,
    aggregateId: event.aggregateId,
  })
}
