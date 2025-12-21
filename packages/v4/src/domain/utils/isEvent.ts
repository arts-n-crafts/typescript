import type { BaseEvent } from '@domain/BaseEvent.ts'

export function isEvent(event: unknown): event is BaseEvent {
  if (typeof event !== 'object')
    return false
  if (event === null)
    return false
  if (!('type' in event))
    return false
  return 'source' in event
}
