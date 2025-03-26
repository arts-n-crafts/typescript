import type { CreateUserCommand } from './CreateUserCommand'
import { User } from '../../../domain/AggregateRoot/examples/User'
import { CommandHandler } from '../CommandHandler'

export class CreateUserCommandHandler extends CommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand) {
    const aggregate = User.create(command.aggregateId, command.payload)
    await this.repository.store(aggregate)
    return { id: aggregate.id }
  }
}
