import type { Command, CommandMetadata } from '@core/Command.ts'
import { randomUUID } from 'node:crypto'
import { getTimestamp } from '@core/utils/getTimestamp.ts'

export function createCommand<TType extends string, TPayload>(type: TType, aggregateId: string, aggregateType: string, payload: TPayload, metadata: Partial<CommandMetadata> = {}): Command<TType, TPayload> {
  return Object.freeze({
    id: randomUUID(),
    type,
    aggregateType,
    aggregateId: String(aggregateId),
    payload,
    kind: 'command',
    timestamp: getTimestamp(),
    metadata,
  })
}
