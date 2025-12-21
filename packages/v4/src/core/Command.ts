import type { WithIdentifier } from './types/WithIdentifier.ts'

export interface CommandMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface Command<TType = string, TPayload = unknown> extends WithIdentifier {
  type: TType
  aggregateId: string
  payload: TPayload
  kind: 'command'
  timestamp: number
  metadata: Partial<CommandMetadata>
}
