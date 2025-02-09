import { MockUserNameUpdatedEvent } from "../../../domain/DomainEvent/mocks/MockUserNameUpdated";
import { CommandHandler } from "../CommandHandler";
import type { MockUpdateUserNameCommand } from "./MockUpdateUserNameCommand";

export class MockUpdateUserNameCommandHandler extends CommandHandler<MockUpdateUserNameCommand> {
  async execute(command: MockUpdateUserNameCommand) {
    const { aggregateId, ...payload } = command.payload;
    const event = new MockUserNameUpdatedEvent( aggregateId, payload );
    const aggregate = await this.repository.load(aggregateId);
    aggregate.apply(event)
    await this.repository.store(aggregate);
  }
}
