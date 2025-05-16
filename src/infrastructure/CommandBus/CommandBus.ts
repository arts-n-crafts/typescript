import type { Command } from './Command'
import type { CommandHandler, CommandHandlerResult } from './CommandHandler'

export class CommandBus {
  private handlers: Map<string, CommandHandler<Command<unknown, unknown>>> = new Map()

  register<TId, TPayload>(
    aTypeOfCommand: string,
    anHandler: CommandHandler<Command<TPayload, TId>>,
  ): void {
    if (this.handlers.has(aTypeOfCommand)) {
      throw new Error(`Handler already registered for command type: ${aTypeOfCommand}`)
    }
    this.handlers.set(aTypeOfCommand, anHandler)
  }

  async execute(aCommand: Command<unknown, unknown>): Promise<CommandHandlerResult> {
    const handler = this.handlers.get(aCommand.type)
    if (!handler) {
      throw new Error(`No handler found for command type: ${aCommand.type}`)
    }
    return handler.execute(aCommand)
  }
}
