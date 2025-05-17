import type { AggregateRoot } from '../../domain/AggregateRoot/AggregateRoot'
import type { Repository } from '../Repository/Repository'
import type { Command } from './Command'

export type CommandHandlerResult = { id: string } | void

export abstract class CommandHandler<TCommand extends Command<unknown, unknown>> {
  constructor(
    protected repository: Repository<AggregateRoot<unknown>>,
  ) { }

  abstract execute(command: TCommand): Promise<CommandHandlerResult>
}
