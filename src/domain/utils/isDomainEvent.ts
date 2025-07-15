import type { DomainEvent } from '../DomainEvent.ts'
import { isEvent } from './isEvent.ts'

export function isDomainEvent<TEvent extends DomainEvent<TEvent['payload']>>(event: unknown): event is TEvent {
  return isEvent(event)
    && event.source === 'internal'
}
