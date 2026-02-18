import type { CommandHandler } from '@core/CommandHandler.ts'
import type { RegisterUserCommand } from '@core/examples/CreateUser.ts'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import { User } from '@domain/examples/User.ts'
import { isRejection } from '@domain/utils/isRejection.ts'

export class CreateUserHandler implements CommandHandler<RegisterUserCommand> {
  constructor(
    private readonly repository: Repository<UserEvent, Promise<UserState>, Promise<void>>,
    private readonly outbox: Outbox,
  ) {}

  async execute(aCommand: RegisterUserCommand): Promise<void> {
    const currentState = await this.repository.load(<string>aCommand.aggregateId)
    const result = User.decide(aCommand, currentState)
    if (isRejection(result)) {
      await this.outbox.enqueue(result)
    }
    else {
      await this.repository.store(result)
    }
  }
}
