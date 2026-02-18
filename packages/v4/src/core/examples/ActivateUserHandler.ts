import type { CommandHandler } from '@core/CommandHandler.ts'
import type { ActivateUserCommand } from '@core/examples/ActivateUser.ts'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { User } from '@domain/examples/User.ts'
import { isRejection } from '@domain/utils/isRejection.ts'

export class ActivateUserHandler implements CommandHandler<ActivateUserCommand> {
  constructor(
    private readonly repository: Repository<UserEvent, Promise<UserState>>,
  ) {}

  async execute(command: ActivateUserCommand): Promise<void> {
    const currentState = await this.repository.load(<string>command.aggregateId)
    const result = User.decide(command, currentState)
    if (!isRejection(result)) {
      await this.repository.store(result)
    }
  }
}
