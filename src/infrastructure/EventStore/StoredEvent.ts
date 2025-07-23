import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { StreamKey } from '@utils/index.ts'

export interface StoredEvent<TEvent extends DomainEvent> {
  id: string
  streamKey: StreamKey
  version: number
  createdAt: string
  event: TEvent
}
