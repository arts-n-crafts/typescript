import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StreamKey } from '@utils/streamKey/index.ts'

export type EventStoreResult = { id: string } | void

export interface EventStore {
  load(streamKey: StreamKey): Promise<unknown>
  append<TEvent extends DomainEvent>(streamKey: StreamKey, events: TEvent[]): Promise<unknown>
}
