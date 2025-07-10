import type { Command } from '@core/Command.ts'
import type { CommandHandler, CommandHandlerResult } from '@core/CommandHandler.ts'
import type { UpdateUserNameProps } from '@core/examples/UpdateUserName.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { User } from '@domain/examples/User.ts'

export class UpdateUserNameHandler implements CommandHandler<'UpdateUserName', UpdateUserNameProps> {
  constructor(
    private readonly repository: Repository<UserEvent>,
  ) { }

  async execute(command: Command<'UpdateUserName', UpdateUserNameProps>): Promise<CommandHandlerResult> {
    const pastEvents = await this.repository.load(command.aggregateId)
    const currentState = pastEvents.reduce(User.evolve, User.initialState(command.aggregateId))
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId }
  }
}
