import type { Command, CommandMetadata } from '@core/Command.ts'
import { createCommand } from '@core/utils/createCommand.ts'

export interface ActivateUserProps { }

export function createActivateUserCommand(aggregateId: string, payload: ActivateUserProps, metadata?: Partial<CommandMetadata>): Command<'ActivateUser', ActivateUserProps> {
  return createCommand('ActivateUser', aggregateId, 'User', payload, metadata)
}

export type ActivateUserCommand = ReturnType<typeof createActivateUserCommand>
