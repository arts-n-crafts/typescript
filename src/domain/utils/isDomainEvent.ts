import type { DomainEvent } from '../DomainEvent.ts'
import { isEvent } from './isEvent.ts'

export function isDomainEvent<T = unknown>(event: unknown): event is DomainEvent<T> {
  return isEvent(event)
    && event.source === 'internal'
}
