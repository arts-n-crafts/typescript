import type { IRepository } from '../../../domain'
import type { User } from '../../../domain/AggregateRoot/examples/User'
import type { Command } from '../Command'
import type { ICommandHandler } from '../ICommandHandler'
import type { UpdateUserNameProps } from './UpdateUserName'

export class UpdateUserNameHandler implements ICommandHandler<UpdateUserNameProps> {
  constructor(
    private readonly repository: IRepository<User>,
  ) { }

  async execute(command: Command<UpdateUserNameProps>) {
    const { aggregateId, payload } = command
    const aggregate = await this.repository.load(aggregateId)
    aggregate.changeName(payload.name)
    await this.repository.store(aggregate)
  }
}
