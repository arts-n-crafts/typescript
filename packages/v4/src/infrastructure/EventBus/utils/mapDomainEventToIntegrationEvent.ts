import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { IntegrationEvent, IntegrationEventMetadata } from '@infrastructure/EventBus/IntegrationEvent.ts'

export function mapDomainEventToIntegrationEvent<TPayload>(
  domainEvent: DomainEvent<TPayload>,
): IntegrationEvent<TPayload> {
  const metadata: Partial<IntegrationEventMetadata> = {
    ...domainEvent.metadata,
    aggregateType: domainEvent.aggregateType,
    aggregateId: domainEvent.aggregateId,
    outcome: 'accepted',
  }

  return {
    id: domainEvent.id,
    type: domainEvent.type,
    payload: domainEvent.payload,
    timestamp: new Date(domainEvent.timestamp).toISOString(),
    metadata,
    kind: 'integration',
  }
}
