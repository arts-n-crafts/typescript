import type { Command } from '../Command'
import type { UpdateUserNameProps } from './UpdateUserName'
import { UserNameUpdated } from '../../../domain/DomainEvent/examples/UserNameUpdated'
import { CommandHandler } from '../CommandHandler'

type CommandType = Command<UpdateUserNameProps, string>

export class UpdateUserNameHandler extends CommandHandler<CommandType> {
  async execute(command: CommandType) {
    const { aggregateId, payload } = command
    const event = UserNameUpdated(aggregateId, payload)
    const aggregate = await this.repository.load(aggregateId)
    aggregate.apply(event)
    await this.repository.store(aggregate)
  }
}
