import type { Command } from '@core/Command.ts'
import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'
import type { CreateUserProps } from '@core/examples/CreateUser.ts'
import type { UserState } from '@domain/examples/User.ts'
import type { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { User } from '@domain/examples/User.ts'

export class CreateUserHandler implements CommandHandler<'CreateUser', CreateUserProps> {
  constructor(
    private readonly repository: UserRepository,
  ) {
  }

  async execute<TResult = CommandHandlerResult>(command: Command<'CreateUser', CreateUserProps>): Promise<TResult> {
    const currentState = await this.repository.load<UserState>(command.aggregateId)
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId } as TResult
  }
}
