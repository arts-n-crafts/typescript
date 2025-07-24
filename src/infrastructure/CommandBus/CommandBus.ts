import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'

export interface CommandBus {
  register(aTypeOfCommand: string, anHandler: CommandHandler): unknown

  execute(aCommand: Command): Promise<unknown>
}
