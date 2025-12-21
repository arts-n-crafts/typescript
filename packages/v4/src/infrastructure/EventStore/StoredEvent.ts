import type { StreamKey } from '@utils/streamKey/StreamKey.ts'

/**
 * StoredEvent wraps a DomainEvent for persistence in the event store with its
 * stream coordinates and version. This table must be immutable, append-only.
 */
export interface StoredEvent<TEvent> {
  /** Same as DomainEvent.id. */
  id: string
  /** Stream key, e.g., `${aggregateType}#${aggregateId}`. */
  streamKey: StreamKey
  /** Aggregate version after applying this event. */
  version: number
  /** Epoch millis for write-time ordering. */
  timestamp: number
  /** The actual domain event. */
  event: TEvent
}
