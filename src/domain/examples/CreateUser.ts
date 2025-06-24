import type { Command, CommandMetadata } from '../Command'
import { createCommand } from '../utils/createCommand'

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
