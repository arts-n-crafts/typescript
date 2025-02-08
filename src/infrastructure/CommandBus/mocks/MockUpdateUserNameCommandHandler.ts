import { MockUserNameUpdatedEvent } from "../../../domain/DomainEvent/mocks/MockUserNameUpdated";
import { CommandHandler } from "../CommandHandler";
import type { MockUpdateUserNameCommand } from "./MockUpdateUserNameCommand";

export class MockUpdateUserNameCommandHandler extends CommandHandler<MockUpdateUserNameCommand> {
  async execute(command: MockUpdateUserNameCommand) {
    const aggregateId = '123'
    const eventPayload = { name: command.payload.name }
    const eventMetadata = {
      causationId: '321',
      timestamp: new Date()
    }
    const event = new MockUserNameUpdatedEvent(
      aggregateId, eventPayload
    )
    event.applyMetadata(eventMetadata)
    this.eventStore.store(event)
  }
}
