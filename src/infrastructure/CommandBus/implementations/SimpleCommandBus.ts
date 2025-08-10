import type { Command } from '@core/Command.ts'
import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'
import type { CommandBus } from '../CommandBus.ts'

export class SimpleCommandBus<TCommand extends Command> implements CommandBus<TCommand, CommandHandlerResult> {
  private handlers: Map<TCommand['type'], CommandHandler<TCommand, CommandHandlerResult>> = new Map()

  register(aTypeOfCommand: TCommand['type'], anHandler: CommandHandler<TCommand>): void {
    if (this.handlers.has(aTypeOfCommand)) {
      throw new Error(`Handler already registered for command type: ${aTypeOfCommand}`)
    }
    this.handlers.set(aTypeOfCommand, anHandler)
  }

  async execute(aCommand: TCommand): Promise<CommandHandlerResult> {
    const handler = this.handlers.get(aCommand.type)
    if (!handler) {
      throw new Error(`No handler found for command type: ${aCommand.type}`)
    }
    return handler.execute(aCommand)
  }
}
