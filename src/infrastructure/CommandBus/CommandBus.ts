import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'
import type { Command } from '@domain/Command.ts'

export interface CommandBus {
  register: (aTypeOfCommand: string, anHandler: CommandHandler<any, any>) => void
  execute: (aCommand: Command<string, unknown>) => Promise<CommandHandlerResult>
}
