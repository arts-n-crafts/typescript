import type { DomainEvent } from '../../../domain/DomainEvent/DomainEvent'
import type { EventStore } from '../../EventStore/EventStore'
import { MockUserCreatedEvent } from '../../../domain/DomainEvent/mocks/MockUserCreated'
import { MockUserRegistrationEmailSentEvent } from '../../../domain/DomainEvent/mocks/MockUserRegistrationEmailSent'
import { EventHandler } from '../EventHandler'

export class MockUserCreatedEventHandler
  extends EventHandler<MockUserCreatedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {
    super()
  }

  async handle(event: DomainEvent<unknown>): Promise<void> {
    if (event instanceof MockUserCreatedEvent) {
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
}
