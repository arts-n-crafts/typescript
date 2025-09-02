import type { Command } from '@core/Command.ts'

export interface CommandHandler<CommandType extends Command, TReturnType = Promise<void>> {
  execute(aCommand: CommandType): TReturnType
}
