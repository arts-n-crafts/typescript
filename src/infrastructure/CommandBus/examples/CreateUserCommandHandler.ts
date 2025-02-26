import type { CreateUserCommand } from './CreateUserCommand'
import { randomUUID } from 'node:crypto'
import { User } from '../../../domain/AggregateRoot/examples/User'
import { CommandHandler } from '../CommandHandler'

export class CreateUserCommandHandler extends CommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand) {
    const aggregateId = randomUUID()
    const aggregate = User.create(command.payload, aggregateId)
    await this.repository.store(aggregate)
    return { id: aggregateId }
  }
}
