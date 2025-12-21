import type { StreamKey } from '@utils/streamKey/StreamKey.ts'

export function makeStreamKey(streamName: string, aggregateId: string): StreamKey {
  return `${streamName}#${aggregateId}`
}
