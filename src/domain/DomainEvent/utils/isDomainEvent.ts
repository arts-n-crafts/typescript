import type { DomainEvent } from '../DomainEvent'

export function isDomainEvent(event: unknown): event is DomainEvent {
  if (typeof event !== 'object')
    return false
  if (Array.isArray(event))
    return false
  if (event === null)
    return false
  return 'aggregateId' in event
}
