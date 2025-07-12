import type { Query } from '@core/Query.ts'

export function isQuery(candidate: unknown): candidate is Query<unknown> {
  if (candidate === null)
    return false
  if (typeof candidate !== 'object')
    return false
  if (!('type' in candidate))
    return false
  return 'kind' in candidate && candidate.kind === 'query'
}
