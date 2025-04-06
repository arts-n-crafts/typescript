import type { BaseEvent } from '../Event'

export function isEvent<T = unknown>(event: unknown): event is BaseEvent<T> {
  if (typeof event !== 'object' || event === null)
    return false
  if (!('type' in event))
    return false
  if (!('metadata' in event))
    return false
  if (typeof event.metadata !== 'object' || event.metadata === null)
    return false
  return 'source' in event.metadata
}
