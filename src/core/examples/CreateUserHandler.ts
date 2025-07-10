import type { Command } from '@core/Command.ts'
import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'
import type { CreateUserProps } from '@core/examples/CreateUser.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { User } from '@domain/examples/User.ts'

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
