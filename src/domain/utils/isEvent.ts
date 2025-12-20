import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'

export function isEvent(event: unknown): event is DomainEvent | IntegrationEvent | ExternalEvent {
  if (typeof event !== 'object')
    return false
  if (event === null)
    return false
  if (!('type' in event))
    return false
  return 'kind' in event
}
