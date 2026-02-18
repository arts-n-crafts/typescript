import type { CommandHandler } from '@core/CommandHandler.ts'
import type { UpdateUserNameCommand } from '@core/examples/UpdateUserName.ts'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { User } from '@domain/examples/User.ts'

export class UpdateUserNameHandler implements CommandHandler<UpdateUserNameCommand> {
  constructor(
    private readonly repository: Repository<UserEvent, Promise<UserState>, Promise<void>>,
  ) {}

  async execute(command: UpdateUserNameCommand): Promise<void> {
    const currentState = await this.repository.load(<string>command.aggregateId)
    await this.repository.store(User.decide(command, currentState) as UserEvent[])
  }
}
