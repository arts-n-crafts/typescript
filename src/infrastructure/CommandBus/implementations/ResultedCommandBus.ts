import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'
import type { WithIdentifier } from '@core/types/WithIdentifier.ts'
import type { Result } from 'oxide.ts'
import type { CommandBus } from '../CommandBus.ts'
import { Err, Ok } from 'oxide.ts'

export type ResultedCommandBusExecutionReturnType = Result<WithIdentifier, Error>

export class ResultedCommandBus<TCommand extends Command> implements CommandBus<TCommand, ResultedCommandBusExecutionReturnType, Result<void, Error>> {
  private handlers: Map<TCommand['type'], CommandHandler<TCommand, WithIdentifier>> = new Map()

  register(aTypeOfCommand: TCommand['type'], anHandler: CommandHandler<TCommand, WithIdentifier>): Result<void, Error> {
    if (this.handlers.has(aTypeOfCommand)) {
      return Err(new Error(`Handler already registered for command type: ${aTypeOfCommand}`))
    }
    this.handlers.set(aTypeOfCommand, anHandler)
    return Ok(undefined)
  }

  async execute(aCommand: TCommand): Promise<ResultedCommandBusExecutionReturnType> {
    const handler = this.handlers.get(aCommand.type)
    if (!handler) {
      return Err(new Error(`No handler found for command type: ${aCommand.type}`))
    }
    const result = await handler.execute(aCommand)
    return Ok(result)
  }
}
