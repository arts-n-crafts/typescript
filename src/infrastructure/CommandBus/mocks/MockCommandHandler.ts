import { MockUserNameUpdatedEvent } from "../../../domain/DomainEvent/mocks/MockUserNameUpdated";
import { CommandHandler } from "../CommandHandler";
import type { MockCommand } from "./MockCommand";

export class MockCommandHandler extends CommandHandler<MockCommand> {
  async execute(command: MockCommand) {
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
