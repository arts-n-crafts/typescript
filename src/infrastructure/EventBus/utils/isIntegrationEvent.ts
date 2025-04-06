import type { BaseEvent } from '../Event'
import type { IntegrationEvent } from '../IntegrationEvent'
import { isEvent } from './isEvent'

export function isIntegrationEvent<T = unknown>(event: BaseEvent<T>): event is IntegrationEvent<T> {
  return isEvent(event)
    && event.metadata.source === 'external'
}
