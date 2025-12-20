import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import { isEvent } from '@domain/utils/isEvent.ts'

export function isExternalEvent<TPayload>(event: unknown): event is ExternalEvent<TPayload> {
  return isEvent(event)
    && event.kind === 'external'
}
