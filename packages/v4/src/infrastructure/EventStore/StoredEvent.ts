import type { StreamKey } from '@utils/streamKey/StreamKey.ts'

export interface StoredEvent<TEvent> {
  id: string
  streamKey: StreamKey
  version: number
  createdAt: string
  event: TEvent
}
