import type { Command } from '../Command'
import type { CreateUserProps } from './CreateUser'
import { User } from '../../../domain/AggregateRoot/examples/User'
import { CommandHandler } from '../CommandHandler'

type CommandType = Command<CreateUserProps, string>

export class CreateUserHandler extends CommandHandler<User, CommandType> {
  async execute(command: CommandType) {
    const aggregate = User.create(command.aggregateId, command.payload)
    await this.repository.store(aggregate)
    return { id: aggregate.id }
  }
}
