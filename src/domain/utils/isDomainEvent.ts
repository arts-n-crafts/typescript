import type { DomainEvent } from '../DomainEvent'
import { isEvent } from './isEvent'

export function isDomainEvent<TPayload>(event: unknown): event is DomainEvent<TPayload> {
  return isEvent(event)
    && event.source === 'internal'
}
