import type { Command } from '@core/Command.ts'

export type CommandHandlerResult = { id: string } | void

export interface CommandHandler<CommandType extends Command, TReturnType = CommandHandlerResult> {
  execute(aCommand: CommandType): Promise<TReturnType>
}
