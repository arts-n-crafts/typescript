import type { CommandMetadata } from '../Command'
import { createCommand } from '../utils/createCommand'

export interface UpdateUserNameProps {
  name: string
}

export function UpdateUserName(aggregateId: string, payload: UpdateUserNameProps, metadata?: Partial<CommandMetadata>) {
  return createCommand('UpdateUserName', aggregateId, payload, metadata)
}
