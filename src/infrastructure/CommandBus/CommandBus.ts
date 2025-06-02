import type { Command } from './Command'
import type { ICommandBus } from './ICommandBus'
import type { CommandHandlerResult, ICommandHandler } from './ICommandHandler'

export class CommandBus implements ICommandBus {
  private handlers: Map<string, ICommandHandler<any>> = new Map()

  register(
    aTypeOfCommand: string,
    anHandler: ICommandHandler<any>,
  ): void {
    if (this.handlers.has(aTypeOfCommand)) {
      throw new Error(`Handler already registered for command type: ${aTypeOfCommand}`)
    }
    this.handlers.set(aTypeOfCommand, anHandler)
  }

  async execute(aCommand: Command): Promise<CommandHandlerResult> {
    const handler = this.handlers.get(aCommand.type)
    if (!handler) {
      throw new Error(`No handler found for command type: ${aCommand.type}`)
    }
    return handler.execute(aCommand)
  }
}
