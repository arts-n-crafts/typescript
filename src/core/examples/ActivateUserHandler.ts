import type { Command, Repository } from '../../domain'
import type { ActivateUserProps } from '../../domain/examples/ActivateUser.ts'
import type { UserEvent } from '../../domain/examples/User.ts'
import type { CommandHandler } from '../CommandHandler.ts'
import { User } from '../../domain/examples/User.ts'

export class ActivateUserHandler implements CommandHandler<'ActivateUser', ActivateUserProps> {
  constructor(
    private readonly repository: Repository<UserEvent>,
  ) {}

  async execute(command: Command<'ActivateUser', ActivateUserProps>) {
    const pastEvents = await this.repository.load(command.aggregateId)
    const currentState = pastEvents.reduce(User.evolve, User.initialState(command.aggregateId))
    await this.repository.store(User.decide(command, currentState))
  }
}
