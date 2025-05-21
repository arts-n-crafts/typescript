import type { AggregateRoot } from '../../domain/AggregateRoot/AggregateRoot'
import type { Repository } from '../Repository/Repository'
import type { Command } from './Command'

export type CommandHandlerResult = { id: string } | void

export abstract class CommandHandler<TAggregate extends AggregateRoot<TAggregate['props']>, TCommand extends Command<unknown, unknown>> {
  constructor(
    protected repository: Repository<TAggregate>,
  ) { }

  abstract execute(command: TCommand): Promise<CommandHandlerResult>
}
