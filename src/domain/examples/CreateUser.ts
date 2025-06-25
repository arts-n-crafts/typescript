import type { Command, CommandMetadata } from '@domain/Command.ts'
import { createCommand } from '@domain/utils/createCommand.ts'

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
