import type { Command, CommandMetadata } from '@core/Command.ts'
import { createCommand } from '@core/utils/createCommand.ts'

export interface CreateUserProps {
  name: string
  email: string
  age?: number
}

export function CreateUser(
  aggregateId: string,
  payload: CreateUserProps,
  metadata?: Partial<CommandMetadata>,
): Command<'CreateUser', CreateUserProps> {
  return createCommand('CreateUser', aggregateId, payload, metadata)
}
