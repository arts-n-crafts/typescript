import type { MockCreateUserCommand } from './MockCreateUserCommand'
import { randomUUID } from 'node:crypto'
import { MockUser } from '../../../domain/AggregateRoot/mocks/MockUser'
import { CommandHandler } from '../CommandHandler'

export class MockCreateUserCommandHandler extends CommandHandler<MockCreateUserCommand> {
  async execute(command: MockCreateUserCommand) {
    const aggregateId = randomUUID()
    const aggregate = MockUser.create(command.payload, aggregateId)
    await this.repository.store(aggregate)
    return { id: aggregateId }
  }
}
