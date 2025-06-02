import type { Command, CommandMetadata } from '../Command'
import { randomUUID } from 'node:crypto'

export function createCommand<TPayload>(type: string, aggregateId: string, payload: TPayload, metadata?: Partial<CommandMetadata>): Command<TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateId: String(aggregateId),
    payload,
    metadata: {
      ...metadata,
      kind: 'command' as const,
      timestamp: new Date().toISOString(),
    },
  })
}
