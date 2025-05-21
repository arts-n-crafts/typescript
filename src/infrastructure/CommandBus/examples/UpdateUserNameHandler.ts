import type { User } from '../../../domain/AggregateRoot/examples/User'
import type { Command } from '../Command'
import type { UpdateUserNameProps } from './UpdateUserName'
import { CommandHandler } from '../CommandHandler'

type CommandType = Command<UpdateUserNameProps, string>

export class UpdateUserNameHandler extends CommandHandler<User, CommandType> {
  async execute(command: CommandType) {
    const { aggregateId, payload } = command
    const aggregate = await this.repository.load(aggregateId)
    aggregate.changeName(payload.name)
    await this.repository.store(aggregate)
  }
}
