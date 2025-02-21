import type { AggregateRoot } from '../../domain/AggregateRoot/AggregateRoot'
import type { Repository } from '../Repository/Repository'
import type { Command } from './Command'

type CommandHandlerResult = { id: string } | void

export abstract class CommandHandler<TCommand extends Command<unknown>> {
  constructor(
    protected repository: Repository<AggregateRoot<unknown>>,
  ) { }

  abstract execute(command: TCommand): Promise<CommandHandlerResult>
}
