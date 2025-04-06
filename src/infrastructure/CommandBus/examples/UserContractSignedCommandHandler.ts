import type { UserContractSignedCommand } from './UserContractSignedCommand'
import { UserContractSigned } from '../../../domain/DomainEvent/examples/UserContractSigned'
import { CommandHandler } from '../CommandHandler'

export class UserContractSignedCommandHandler extends CommandHandler<UserContractSignedCommand> {
  async execute(command: UserContractSignedCommand) {
    const { aggregateId, payload } = command
    const event = UserContractSigned(aggregateId, payload)
    const aggregate = await this.repository.load(aggregateId)
    aggregate.apply(event)
    await this.repository.store(aggregate)
  }
}
