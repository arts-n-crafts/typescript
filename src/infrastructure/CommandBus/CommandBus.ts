import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'
import type { EventStoreResult } from '@infrastructure/EventStore/EventStore.ts'

export interface CommandBus {
  register<TType = string, TPayload = unknown>(aTypeOfCommand: string, anHandler: CommandHandler<TType, TPayload>): void

  execute(aCommand: Command): Promise<EventStoreResult>
  execute<TReturnType>(aCommand: Command): Promise<TReturnType>
}
