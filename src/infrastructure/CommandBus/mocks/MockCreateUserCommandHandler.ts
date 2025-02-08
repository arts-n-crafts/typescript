import { randomUUID } from "crypto";
import { CommandHandler } from "../CommandHandler";
import type { MockCreateUserCommand } from './MockCreateUserCommand';
import { MockUser } from '../../../domain/AggregateRoot/mocks/MockUser';

export class MockCreateUserCommandHandler extends CommandHandler<MockCreateUserCommand> {
  async execute(command: MockCreateUserCommand) {
    const aggregateId = randomUUID();
    const aggregate = MockUser.create(command.payload, aggregateId);
    await this.repository.store(aggregate);
    return { id: aggregateId }
  }
}
