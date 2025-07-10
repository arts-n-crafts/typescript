import type { Command } from '@core/Command.ts'

export function isCommand(candidate: unknown): candidate is Command<string, unknown> {
  if (candidate === null)
    return false
  if (typeof candidate !== 'object')
    return false
  if (!('type' in candidate))
    return false
  if (!('metadata' in candidate))
    return false
  if (candidate.metadata === null)
    return false
  if (typeof candidate.metadata !== 'object')
    return false
  return 'kind' in candidate.metadata && candidate.metadata.kind === 'command'
}
