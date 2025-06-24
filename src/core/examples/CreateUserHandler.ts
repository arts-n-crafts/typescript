import type { Command, Repository } from '../../domain'
import type { CreateUserProps } from '../../domain/examples/CreateUser'
import type { UserEvent } from '../../domain/examples/User'
import type { CommandHandler, CommandHandlerResult } from '../CommandHandler'
import { User } from '../../domain/examples/User'

export class CreateUserHandler implements CommandHandler<'CreateUser', CreateUserProps> {
  constructor(
    private readonly repository: Repository<UserEvent>,
  ) {}

  async execute(command: Command<'CreateUser', CreateUserProps>): Promise<CommandHandlerResult> {
    const currentState = [].reduce(User.evolve, User.initialState(command.aggregateId))
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId }
  }
}
