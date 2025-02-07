import type { EventStore } from "../EventStore/EventStore";
import { Command } from "./Command";

export abstract class CommandHandler<TCommand extends Command<unknown>> {
  constructor(
    protected eventStore: EventStore
  ) { }

  abstract execute(command: TCommand): Promise<void>;
}
