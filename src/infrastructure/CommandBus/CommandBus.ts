import type { Maybe } from '../../core/types/Maybe'
import type { Command, CommandMetadata } from './Command'
import type { CommandHandler } from './CommandHandler'

export class CommandBus {
  private handlers: Map<string, CommandHandler<Command<unknown>>> = new Map()

  register<TPayload>(
    command: new (payload: TPayload, metadata: Maybe<CommandMetadata>) => Command<TPayload>,
    handler: CommandHandler<Command<TPayload>>,
  ): void {
    if (this.handlers.has(command.name)) {
      throw new Error(`Handler already registered for command type: ${command.name}`)
    }
    this.handlers.set(command.name, handler)
  }

  async execute(command: Command<unknown>): Promise<void> {
    const handler = this.handlers.get(command.constructor.name)
    if (!handler) {
      throw new Error(`No handler found for command type: ${command.constructor.name}`)
    }
    await handler.execute(command)
  }
}
