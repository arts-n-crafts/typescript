import type { BaseEvent } from '../../../infrastructure/EventBus/Event'
import type { DomainEvent } from '../DomainEvent'
import { isEvent } from '../../../infrastructure/EventBus/utils/isEvent'

export function isDomainEvent<T = unknown>(event: BaseEvent<T>): event is DomainEvent<T> {
  return isEvent(event)
    && event.metadata.source === 'internal'
}
