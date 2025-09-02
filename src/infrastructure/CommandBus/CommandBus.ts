import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'

interface Registerable<TCommand extends Command, TResult = void> {
  register(aTypeOfCommand: TCommand['type'], anHandler: CommandHandler<TCommand>): TResult
}

interface Executable<TCommand extends Command, TResult = Promise<void>> {
  execute(aCommand: TCommand): TResult
}

export interface CommandBus<TCommand extends Command, TExecutionResult = void, TRegisterResult = void>
  extends
  Executable<TCommand, TExecutionResult>,
  Registerable<TCommand, TRegisterResult>
{ }
