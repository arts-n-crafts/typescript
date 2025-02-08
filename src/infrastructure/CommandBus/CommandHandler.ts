import type { AggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { Repository } from "../Repository/Repository";
import { Command } from "./Command";

export abstract class CommandHandler<TCommand extends Command<unknown>> {
  constructor(
    protected repository: Repository<AggregateRoot<unknown>>
  ) { }

  abstract execute(command: TCommand): Promise<void>;
}
