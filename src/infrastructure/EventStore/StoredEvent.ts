import type { StreamKey } from '@utils/index.ts'

export interface StoredEvent<TEvent> {
  id: string
  streamKey: StreamKey
  version: number
  createdAt: string
  event: TEvent
}
