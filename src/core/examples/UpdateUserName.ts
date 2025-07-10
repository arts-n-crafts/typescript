import type { Command, CommandMetadata } from '@core/Command.ts'
import { createCommand } from '@core/utils/createCommand.ts'

export interface UpdateUserNameProps {
  name: string
}

export function UpdateUserName(
  aggregateId: string,
  payload: UpdateUserNameProps,
  metadata?: Partial<CommandMetadata>,
): Command<'UpdateUserName', UpdateUserNameProps> {
  return createCommand('UpdateUserName', aggregateId, payload, metadata)
}
