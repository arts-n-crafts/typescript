import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'
import type { Command } from '@domain/Command.ts'
import type { CommandBus } from '../CommandBus.ts'

export class InMemoryCommandBus implements CommandBus {
  private handlers: Map<string, CommandHandler<any, any>> = new Map()

  register(
    aTypeOfCommand: string,
    anHandler: CommandHandler<any, any>,
  ): void {
    if (this.handlers.has(aTypeOfCommand)) {
      throw new Error(`Handler already registered for command type: ${aTypeOfCommand}`)
    }
    this.handlers.set(aTypeOfCommand, anHandler)
  }

  async execute(aCommand: Command<string, unknown>): Promise<CommandHandlerResult> {
    const handler = this.handlers.get(aCommand.type)
    if (!handler) {
      throw new Error(`No handler found for command type: ${aCommand.type}`)
    }
    return handler.execute(aCommand)
  }
}
