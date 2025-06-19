import type { DomainEvent } from '../DomainEvent'
import { isEvent } from '../../../infrastructure/EventBus/utils/isEvent'

export function isDomainEvent<T = unknown>(event: unknown): event is DomainEvent<T> {
  return isEvent(event)
    && event.source === 'internal'
}
