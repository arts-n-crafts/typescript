import type { Command } from '@core/Command.ts'
import type { EventStoreResult } from '@infrastructure/EventStore/EventStore.ts'

export type CommandHandlerResult = { id: string } | void

export interface CommandHandler<TType = string, TPayload = unknown> {
  execute(aCommand: Command<TType, TPayload>): Promise<EventStoreResult>
  execute<TReturnType>(aCommand: Command<TType, TPayload>): Promise<TReturnType>
}
