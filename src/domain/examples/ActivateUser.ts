import type { CommandMetadata } from '../Command'
import { createCommand } from '../utils/createCommand'

export interface ActivateUserProps { }

export function ActivateUser(aggregateId: string, payload: ActivateUserProps, metadata?: Partial<CommandMetadata>) {
  return createCommand('ActivateUser', aggregateId, payload, metadata)
}
