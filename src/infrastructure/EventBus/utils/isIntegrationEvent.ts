import type { Event } from '../Event'
import type { IntegrationEvent } from '../IntegrationEvent'

export function isIntegrationEvent(event: Event): event is IntegrationEvent {
  return !('aggregateId' in event)
}
