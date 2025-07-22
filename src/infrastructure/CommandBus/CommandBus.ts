import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'

export interface CommandBus {
  register: <TType = string, TPayload = unknown>(aTypeOfCommand: string, anHandler: CommandHandler<TType, TPayload>) => void
  execute: (aCommand: Command) => Promise<ReturnType<CommandHandler['execute']>>
}
