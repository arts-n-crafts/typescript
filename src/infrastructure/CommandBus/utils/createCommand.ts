import type { CommandMetadata } from '../Command'
import type { Command } from '../ICommand'
import { randomUUID } from 'node:crypto'

export function createCommand<TPayload, TId>(type: string, aggregateId: TId, payload: TPayload, metadata?: Partial<CommandMetadata>, version: number = 1): Command<TPayload, TId> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateId,
    payload,
    metadata: {
      ...metadata,
      kind: 'command',
      timestamp: new Date().toISOString(),
    },
    version,
  })
}
