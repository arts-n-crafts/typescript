export function makeStreamId<Stream extends string, Id extends string>(stream: Stream, id: Id): `${Stream}-${Id}` {
  return `${stream}-${id}`
}
