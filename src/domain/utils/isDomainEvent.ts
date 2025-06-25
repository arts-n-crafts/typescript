import type { DomainEvent } from '../DomainEvent.ts'
import { isEvent } from './isEvent.ts'

export function isDomainEvent<TPayload>(event: unknown): event is DomainEvent<TPayload> {
  return isEvent(event)
    && event.source === 'internal'
}
