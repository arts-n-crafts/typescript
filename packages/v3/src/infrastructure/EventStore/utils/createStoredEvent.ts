import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { makeStreamKey } from '@utils/streamKey/makeStreamKey.ts'

export function createStoredEvent<TEvent extends DomainEvent>(
  streamName: string,
  version: number,
  event: TEvent,
): StoredEvent<TEvent> {
  return Object.freeze({
    id: event.id,
    streamKey: makeStreamKey(streamName, event.aggregateId),
    version,
    createdAt: new Date().toISOString(),
    event,
  })
}
