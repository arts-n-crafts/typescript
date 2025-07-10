export type StreamId = `${string}-${string}`

export function makeStreamId<Stream extends string, Id extends string>(stream: Stream, id: Id): StreamId {
  return `${stream}-${id}`
}
