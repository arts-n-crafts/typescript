import type { Command, CommandMetadata } from '@core/Command.ts'
import { randomUUID } from 'node:crypto'

export function createCommand<TType extends string, TPayload>(type: TType, aggregateId: string, aggregateType: string, payload: TPayload, metadata: Partial<CommandMetadata> = {}): Command<TType, TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateType,
    aggregateId: String(aggregateId),
    payload,
    kind: 'command',
    timestamp: new Date().toISOString(),
    metadata,
  })
}
