import type { IntegrationEvent } from '../IntegrationEvent.ts'
import { isEvent } from '@domain/utils/isEvent.ts'

export function isIntegrationEvent<TPayload>(event: unknown): event is IntegrationEvent<TPayload> {
  return isEvent(event)
    && event.kind === 'integration'
}
