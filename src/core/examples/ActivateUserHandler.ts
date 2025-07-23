import type { Command } from '@core/Command.ts'
import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'
import type { ActivateUserProps } from '@core/examples/ActivateUser.ts'
import type { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { User } from '@domain/examples/User.ts'

export class ActivateUserHandler implements CommandHandler<'ActivateUser', ActivateUserProps> {
  constructor(
    private readonly repository: UserRepository,
  ) {
  }

  async execute<TReturnType = CommandHandlerResult>(command: Command<'ActivateUser', ActivateUserProps>): Promise<TReturnType> {
    const currentState = await this.repository.load(command.aggregateId)
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId } as TReturnType
  }
}
