import type { CommandHandler } from '@core/CommandHandler.ts'
import type { UpdateUserNameCommand } from '@core/examples/UpdateUserName.ts'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { SimpleRepositoryResult } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { User } from '@domain/examples/User.ts'

export class UpdateUserNameHandler implements CommandHandler<UpdateUserNameCommand, { id: string }> {
  constructor(
    private readonly repository: Repository<UserEvent, SimpleRepositoryResult, UserState>,
  ) {
  }

  async execute(command: UpdateUserNameCommand): Promise<{ id: string }> {
    const currentState = await this.repository.load(command.aggregateId)
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId }
  }
}
