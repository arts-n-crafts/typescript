import type { Command, Repository } from '../../domain'
import type { UpdateUserNameProps } from '../../domain/examples/UpdateUserName'
import type { UserEvent } from '../../domain/examples/User'
import type { CommandHandler } from '../CommandHandler'
import { User } from '../../domain/examples/User'

export class UpdateUserNameHandler implements CommandHandler<'UpdateUserName', UpdateUserNameProps> {
  constructor(
    private readonly repository: Repository<UserEvent>,
  ) { }

  async execute(command: Command<'UpdateUserName', UpdateUserNameProps>) {
    const pastEvents = await this.repository.load(command.aggregateId)
    const currentState = pastEvents.reduce(User.evolve, User.initialState(command.aggregateId))
    await this.repository.store(User.decide(command, currentState))
    return { id: command.aggregateId }
  }
}
