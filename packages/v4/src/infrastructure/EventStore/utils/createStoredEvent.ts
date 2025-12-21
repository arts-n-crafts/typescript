import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StoredEvent } from '../StoredEvent.ts'
import { getTimestamp } from '@core/utils/getTimestamp.ts'
import { makeStreamKey } from '@utils/index.ts'

export function createStoredEvent<TEvent extends DomainEvent>(
  streamName: string,
  version: number,
  event: TEvent,
): StoredEvent<TEvent> {
  return Object.freeze({
    id: event.id,
    streamKey: makeStreamKey(streamName, event.aggregateId),
    version,
    timestamp: getTimestamp(),
    event,
  })
}
