import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StreamKey } from '@utils/streamKey/index.ts'

export type EventStoreResult = { id: string } | void

export interface EventStore<TReturnType = void> {
  load<TEvent extends DomainEvent>(streamKey: StreamKey): Promise<TEvent[]>
  load<TReturnType>(streamKey: StreamKey): Promise<TReturnType>

  append<TEvent extends DomainEvent>(streamKey: StreamKey, events: TEvent[]): Promise<TReturnType>
}
