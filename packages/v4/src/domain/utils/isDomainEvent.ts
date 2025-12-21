import type { DomainEvent } from '../DomainEvent.ts'
import { isEvent } from './isEvent.ts'

export function isDomainEvent(event: unknown): event is DomainEvent {
  return isEvent(event)
    && 'aggregateId' in event
    && event.kind === 'domain'
}
