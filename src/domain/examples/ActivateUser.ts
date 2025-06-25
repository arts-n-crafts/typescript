import type { Command, CommandMetadata } from '@domain/Command.ts'
import { createCommand } from '@domain/utils/createCommand.ts'

export interface ActivateUserProps { }

export function ActivateUser(aggregateId: string, payload: ActivateUserProps, metadata?: Partial<CommandMetadata>): Command<'ActivateUser', ActivateUserProps> {
  return createCommand('ActivateUser', aggregateId, payload, metadata)
}
