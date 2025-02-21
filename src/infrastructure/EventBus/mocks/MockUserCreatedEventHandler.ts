import type { MockUserCreatedEvent } from '../../../domain/DomainEvent/mocks/MockUserCreated'
import type { EventStore } from '../../EventStore/EventStore'
import { MockUserRegistrationEmailSentEvent } from '../../../domain/DomainEvent/mocks/MockUserRegistrationEmailSent'
import { EventHandler } from '../EventHandler'

export class MockUserCreatedEventHandler
  extends EventHandler<MockUserCreatedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {
    super()
  }

  async handle(event: MockUserCreatedEvent): Promise<void> {
    const emailSentEvent = new MockUserRegistrationEmailSentEvent(
      event.aggregateId,
      { status: 'SUCCESS' },
    )
    emailSentEvent.applyMetadata({
      causationId: event.metadata?.eventId,
      correlationId: event.metadata?.correlationId,
    })
    await this.eventStore.store(emailSentEvent)
  }
}
