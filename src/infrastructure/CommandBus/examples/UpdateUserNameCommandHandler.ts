import type { UpdateUserNameCommand } from './UpdateUserNameCommand'
import { UserNameUpdatedEvent } from '../../../domain/DomainEvent/examples/UserNameUpdated'
import { CommandHandler } from '../CommandHandler'

export class UpdateUserNameCommandHandler extends CommandHandler<UpdateUserNameCommand> {
  async execute(command: UpdateUserNameCommand) {
    const { aggregateId, payload } = command
    const event = new UserNameUpdatedEvent(aggregateId, payload)
    const aggregate = await this.repository.load(aggregateId)
    aggregate.apply(event)
    await this.repository.store(aggregate)
  }
}
