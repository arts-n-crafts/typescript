import type { Command, CommandMetadata } from '../Command'
import { createCommand } from '../utils/createCommand'

export interface ActivateUserProps { }

export function ActivateUser(aggregateId: string, payload: ActivateUserProps, metadata?: Partial<CommandMetadata>): Command<'ActivateUser', ActivateUserProps> {
  return createCommand('ActivateUser', aggregateId, payload, metadata)
}
