import type { Command } from '../Command'
import type { ActivateUserProps } from './ActivateUser'
import { UserActivated } from '../../../domain/DomainEvent/examples/UserActivated'
import { CommandHandler } from '../CommandHandler'

type CommandType = Command<ActivateUserProps, string>

export class ActivateUserHandler extends CommandHandler<CommandType> {
  async execute(command: CommandType) {
    const { aggregateId, payload } = command
    const event = UserActivated(aggregateId, payload)
    const aggregate = await this.repository.load(aggregateId)
    aggregate.apply(event)
    await this.repository.store(aggregate)
  }
}
