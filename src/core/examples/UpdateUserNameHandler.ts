import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'
import type { UpdateUserNameProps } from '@core/examples/UpdateUserName.ts'
import type { EventStoreResult } from '@infrastructure/EventStore/EventStore.js'
import type { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { User } from '@domain/examples/User.ts'

export class UpdateUserNameHandler implements CommandHandler {
  constructor(
    private readonly repository: UserRepository,
  ) {
  }

  async execute(command: Command<'UpdateUserName', UpdateUserNameProps>): Promise<EventStoreResult> {
    const currentState = await this.repository.load(command.aggregateId)
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId }
  }
}
