import type { CommandHandler, CommandHandlerResult } from '../../core'
import type { Command } from '../../domain'

export interface CommandBus {
  register: (aTypeOfCommand: string, anHandler: CommandHandler<any, any>) => void
  execute: (aCommand: Command<string, unknown>) => Promise<CommandHandlerResult>
}
