import type { Command } from '@core/Command.ts'

export interface CommandHandler<CommandType extends Command, TReturnType = void> {
  execute(aCommand: CommandType): Promise<TReturnType>
}
