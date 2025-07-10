import type { Command } from '@core/Command.ts'
import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'

export interface CommandBus {
  register: (aTypeOfCommand: string, anHandler: CommandHandler<any, any>) => void
  execute: (aCommand: Command<string, unknown>) => Promise<CommandHandlerResult>
}
