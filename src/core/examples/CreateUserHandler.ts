import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'
import type { CreateUserProps } from '@core/examples/CreateUser.ts'
import type { EventStoreResult } from '@infrastructure/EventStore/EventStore.js'
import type { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { User } from '@domain/examples/User.ts'

export class CreateUserHandler implements CommandHandler {
  constructor(
    private readonly repository: UserRepository,
  ) {
  }

  async execute(command: Command<'CreateUser', CreateUserProps>): Promise<EventStoreResult> {
    const currentState = await this.repository.load(command.aggregateId)
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId }
  }
}
