import type { CommandHandler } from '@core/CommandHandler.ts'
import type { ActivateUserCommand } from '@core/examples/ActivateUser.ts'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { User } from '@domain/examples/User.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'

export class ActivateUserHandler implements CommandHandler<ActivateUserCommand> {
  constructor(
    private readonly repository: Repository<UserEvent, Promise<UserState>>,
  ) {
  }

  async execute(command: ActivateUserCommand): Promise<void> {
    const currentState = await this.repository.load(<string>command.aggregateId)
    const decision = User.decide(command, currentState)
    if (isDomainEvent(decision[0]))
      await this.repository.store([decision[0]])
  }
}
