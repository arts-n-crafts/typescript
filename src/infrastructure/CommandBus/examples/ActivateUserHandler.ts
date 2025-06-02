import type { IRepository } from '../../../domain'
import type { User } from '../../../domain/AggregateRoot/examples/User'
import type { Command } from '../Command'
import type { ICommandHandler } from '../ICommandHandler'

export class ActivateUserHandler implements ICommandHandler {
  constructor(
    private readonly repository: IRepository<User>,
  ) {}

  async execute(command: Command) {
    const { aggregateId } = command
    const aggregate = await this.repository.load(aggregateId)
    aggregate.activateUser()
    await this.repository.store(aggregate)
  }
}
