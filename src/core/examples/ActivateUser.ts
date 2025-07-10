import type { Command, CommandMetadata } from '@core/Command.ts'
import { createCommand } from '@core/utils/createCommand.ts'

export interface ActivateUserProps { }

export function ActivateUser(aggregateId: string, payload: ActivateUserProps, metadata?: Partial<CommandMetadata>): Command<'ActivateUser', ActivateUserProps> {
  return createCommand('ActivateUser', aggregateId, payload, metadata)
}
