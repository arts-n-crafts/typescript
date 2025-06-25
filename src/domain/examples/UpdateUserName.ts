import type { Command, CommandMetadata } from '@domain/Command.ts'
import { createCommand } from '@domain/utils/createCommand.ts'

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
