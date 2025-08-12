import type { CommandHandler } from '@core/CommandHandler.ts'
import type { RegisterUserCommand } from '@core/examples/CreateUser.ts'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { User } from '@domain/examples/User.ts'

export class CreateUserHandler implements CommandHandler<RegisterUserCommand> {
  constructor(
    private readonly repository: Repository<UserEvent, UserState>,
  ) {
  }

  async execute(aCommand: RegisterUserCommand): Promise<void> {
    const currentState = await this.repository.load(aCommand.aggregateId)
    await this.repository.store(User.decide(aCommand, currentState))
  }
}
