import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { OutboxEntry } from '../OutboxEntry.ts'
import { randomUUID } from 'node:crypto'

export function createOutboxEntry(
  event: DomainEvent<unknown>,
): OutboxEntry {
  return Object.freeze({
    id: randomUUID(),
    event,
    published: false,
    retryCount: 0,
    lastAttemptAt: undefined,
  })
}
