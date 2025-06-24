interface Event {
  type: string
  source: string
}

export function isEvent(event: unknown): event is Event {
  if (typeof event !== 'object')
    return false
  if (event === null)
    return false
  if (!('type' in event))
    return false
  return 'source' in event
}
