import type { EventStore } from "../EventStore/EventStore";
import { Command, type ICommand } from "./Command";

export interface ICommandHandler {
  execute(
    command: Command<ICommand['payload'], ICommand['metadata']>
  ): Promise<void>;
}

export abstract class CommandHandler<
  TCommand extends Command<ICommand['payload'], ICommand['metadata']>
> implements ICommandHandler {
  constructor(
    protected eventStore: EventStore
  ) { }

  abstract execute(command: TCommand): Promise<void>;
}
