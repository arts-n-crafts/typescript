import type { BaseEvent } from '../BaseEvent'

export function isEvent<T = unknown>(event: unknown): event is BaseEvent<T> {
  if (typeof event !== 'object')
    return false
  if (event === null)
    return false
  if (!('type' in event))
    return false
  return 'source' in event
}
