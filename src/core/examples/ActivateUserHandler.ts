import type { Command, Repository } from '../../domain'
import type { ActivateUserProps } from '../../domain/examples/ActivateUser'
import type { UserEvent } from '../../domain/examples/User'
import type { CommandHandler, CommandHandlerResult } from '../CommandHandler'
import { User } from '../../domain/examples/User'

export class ActivateUserHandler implements CommandHandler<'ActivateUser', ActivateUserProps> {
  constructor(
    private readonly repository: Repository<UserEvent>,
  ) {}

  async execute(command: Command<'ActivateUser', ActivateUserProps>): Promise<CommandHandlerResult> {
    const pastEvents = await this.repository.load(command.aggregateId)
    const currentState = pastEvents.reduce(User.evolve, User.initialState(command.aggregateId))
    await this.repository.store(User.decide(command, currentState))
  }
}
