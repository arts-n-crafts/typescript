import type { StreamKey } from '@utils/streamKey/StreamKey.js'

export function makeStreamKey(streamName: string, aggregateId: string): StreamKey {
  return `${streamName}#${aggregateId}`
}
