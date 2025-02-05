import type { ICommand } from "./Command";
import { type ICommandHandler } from "./CommandHandler";

export class CommandBus {
  private handlers: Map<string, ICommandHandler> = new Map();

  register<TCommand extends ICommand, TPayload, TMetadata>(
    command: new (payload: TPayload, metadata: TMetadata) => TCommand,
    handler: ICommandHandler
  ): void {
    if (this.handlers.has(command.name)) {
      throw new Error(`Handler already registered for command type: ${command.name}`);
    }
    this.handlers.set(command.name, handler);
  }
    
  async execute<TCommand extends ICommand>(command: TCommand): Promise<void> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error(`No handler found for command type: ${command.constructor.name}`);
    }
    await handler.execute(command);
  }
}
