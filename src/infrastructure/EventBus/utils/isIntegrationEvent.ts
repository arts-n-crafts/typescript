import type { IntegrationEvent } from '../IntegrationEvent'
import { isEvent } from '../../../domain/utils/isEvent'

export function isIntegrationEvent<TPayload>(event: unknown): event is IntegrationEvent<TPayload> {
  return isEvent(event)
    && event.source === 'external'
}
