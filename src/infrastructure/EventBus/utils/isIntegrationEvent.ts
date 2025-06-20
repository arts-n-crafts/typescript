import type { BaseEvent } from '../../../domain/BaseEvent.ts'
import type { IntegrationEvent } from '../IntegrationEvent'
import { isEvent } from '../../../domain/utils/isEvent.ts'

export function isIntegrationEvent<T = unknown>(event: BaseEvent<T>): event is IntegrationEvent<T> {
  return isEvent(event)
    && event.source === 'external'
}
