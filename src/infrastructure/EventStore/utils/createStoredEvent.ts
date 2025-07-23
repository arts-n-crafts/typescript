import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StreamKey } from '@utils/index.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { randomUUID } from 'node:crypto'

export function createStoredEvent<TEvent extends DomainEvent>(
  streamKey: StreamKey,
  version: number,
  event: TEvent,
): StoredEvent<TEvent> {
  return Object.freeze({
    id: randomUUID(),
    streamKey,
    version,
    createdAt: new Date().toISOString(),
    event,
  })
}
