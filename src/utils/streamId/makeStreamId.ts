import type { StreamId } from '@utils/streamId/StreamId.js'

export function makeStreamId<Stream extends string, Id extends string>(stream: Stream, id: Id): StreamId {
  return `${stream}-${id}`
}
