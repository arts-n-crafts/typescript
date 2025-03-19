import type { Maybe } from '../../core/types/Maybe'
import type { Command, CommandMetadata } from './Command'
import type { CommandHandler, CommandHandlerResult } from './CommandHandler'

export class CommandBus {
  private handlers: Map<string, CommandHandler<Command<unknown, unknown>>> = new Map()

  register<TId, TPayload>(
    command: new (aggregateId: TId, payload: TPayload, metadata: Maybe<CommandMetadata>) => Command<TPayload, TId>,
    handler: CommandHandler<Command<TPayload, TId>>,
  ): void {
    if (this.handlers.has(command.name)) {
      throw new Error(`Handler already registered for command type: ${command.name}`)
    }
    this.handlers.set(command.name, handler)
  }

  async execute(command: Command<unknown, unknown>): Promise<CommandHandlerResult> {
    const handler = this.handlers.get(command.constructor.name)
    if (!handler) {
      throw new Error(`No handler found for command type: ${command.constructor.name}`)
    }
    return handler.execute(command)
  }
}
