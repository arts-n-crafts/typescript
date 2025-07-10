import type { Query } from '@core/Query.ts'

export function isQuery(candidate: unknown): candidate is Query<unknown> {
  if (candidate === null)
    return false
  if (typeof candidate !== 'object')
    return false
  if (!('type' in candidate))
    return false
  if (!('metadata' in candidate))
    return false
  if (typeof candidate.metadata !== 'object')
    return false
  if (candidate.metadata === null)
    return false
  return 'kind' in candidate.metadata && candidate.metadata.kind === 'query'
}
