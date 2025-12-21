import type { Command, CommandMetadata } from '@core/Command.ts'
import { randomUUID } from 'node:crypto'

export function createCommand<TType extends string, TPayload>(type: TType, aggregateId: string, payload: TPayload, metadata: Partial<CommandMetadata> = {}): Command<TType, TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateId: String(aggregateId),
    payload,
    kind: 'command' as const,
    timestamp: Math.floor(new Date().getTime() / 1000),
    metadata,
  })
}
