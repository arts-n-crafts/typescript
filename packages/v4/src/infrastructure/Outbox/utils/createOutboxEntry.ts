import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import type { OutboxEntry } from '../OutboxEntry.ts'
import { randomUUID } from 'node:crypto'

export function createOutboxEntry(
  event: IntegrationEvent,
): OutboxEntry {
  return {
    id: randomUUID(),
    event,
    published: false,
    retryCount: 0,
    lastAttemptAt: undefined,
  }
}
