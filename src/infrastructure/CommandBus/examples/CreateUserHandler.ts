import type { IRepository } from '../../../domain'
import type { Command } from '../Command'
import type { ICommandHandler } from '../ICommandHandler'
import type { CreateUserProps } from './CreateUser'
import { User } from '../../../domain/AggregateRoot/examples/User'

export class CreateUserHandler implements ICommandHandler<CreateUserProps> {
  constructor(
    private readonly repository: IRepository<User>,
  ) {}

  async execute(command: Command<CreateUserProps>) {
    const aggregate = User.create(command.aggregateId, command.payload)
    await this.repository.store(aggregate)
    return { id: aggregate.id }
  }
}
