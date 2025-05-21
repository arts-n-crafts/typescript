import type { User } from '../../../domain/AggregateRoot/examples/User'
import type { Command } from '../Command'
import type { ActivateUserProps } from './ActivateUser'
import { CommandHandler } from '../CommandHandler'

type CommandType = Command<ActivateUserProps, string>

export class ActivateUserHandler extends CommandHandler<User, CommandType> {
  async execute(command: CommandType) {
    const { aggregateId } = command
    const aggregate = await this.repository.load(aggregateId)
    aggregate.activateUser()
    await this.repository.store(aggregate)
  }
}
