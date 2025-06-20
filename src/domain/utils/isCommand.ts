import type { Command } from '../Command.ts'

export function isCommand(candidate: unknown): candidate is Command<string, unknown> {
  if (candidate === null)
    return false
  if (typeof candidate !== 'object')
    return false
  if (!('type' in candidate))
    return false
  return 'kind' in candidate && candidate.kind === 'command'
}
