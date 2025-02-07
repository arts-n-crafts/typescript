import type { MockUserCreatedEvent } from "../../../domain/DomainEvent/mocks/MockUserCreated";
import { MockUserRegistrationEmailSentEvent } from "../../../domain/DomainEvent/mocks/MockUserRegistrationEmailSent";
import type { EventStore } from "../../EventStore/EventStore";
import { EventHandler } from "../EventHandler";



export class MockUserCreatedEventHandler
  extends EventHandler<MockUserCreatedEvent> {
  constructor(
    private readonly eventStore: EventStore
  ) {
    super();
  }

  async handle(event: MockUserCreatedEvent): Promise<void> {
    const emailSentEvent = new MockUserRegistrationEmailSentEvent(
      event.aggregateId,
      { status: 'SUCCESS' }
    );
    this.eventStore.store(emailSentEvent)
  }
}
