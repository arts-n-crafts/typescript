import type { Command, CommandMetadata } from '../Command'
import { randomUUID } from 'node:crypto'

export function createCommand<TPayload, TId>(type: string, aggregateId: TId, payload: TPayload, metadata?: Partial<CommandMetadata>): Command<TPayload, TId> {
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
  })
}
