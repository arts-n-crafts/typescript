import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'

interface Registerable<TCommand extends Command, TResult = void> {
  register(aTypeOfCommand: TCommand['type'], anHandler: CommandHandler<TCommand>): TResult
}

interface Executable<TCommand extends Command, TResult = void> {
  execute(aCommand: TCommand): Promise<TResult>
}

export interface CommandBus<TCommand extends Command, TExecutionResult = void, TRegisterResult = void>
  extends Registerable<TCommand, TRegisterResult>, Executable<TCommand, TExecutionResult>
{
  register(aTypeOfCommand: string, anHandler: CommandHandler<TCommand>): TRegisterResult

  execute(aCommand: Command): Promise<TExecutionResult>
}
