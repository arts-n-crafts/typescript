import type { ActivateUserCommand } from './ActivateUserCommand'
import { UserActivated } from '../../../domain/DomainEvent/examples/UserActivated'
import { CommandHandler } from '../CommandHandler'

export class ActivateUserCommandHandler extends CommandHandler<ActivateUserCommand> {
  async execute(command: ActivateUserCommand) {
    const { aggregateId, payload } = command
    const event = UserActivated(aggregateId, payload)
    const aggregate = await this.repository.load(aggregateId)
    aggregate.apply(event)
    await this.repository.store(aggregate)
  }
}
