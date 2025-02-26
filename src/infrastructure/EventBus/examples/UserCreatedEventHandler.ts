import type { DomainEvent } from '../../../domain/DomainEvent/DomainEvent'
import type { EventStore } from '../../EventStore/EventStore'
import { UserCreatedEvent } from '../../../domain/DomainEvent/examples/UserCreated'
import { UserRegistrationEmailSentEvent } from '../../../domain/DomainEvent/examples/UserRegistrationEmailSent'
import { EventHandler } from '../EventHandler'

export class UserCreatedEventHandler
  extends EventHandler<UserCreatedEvent> {
  constructor(
    private readonly eventStore: EventStore,
  ) {
    super()
  }

  async handle(event: DomainEvent<unknown>): Promise<void> {
    if (event instanceof UserCreatedEvent) {
      const emailSentEvent = new UserRegistrationEmailSentEvent(
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
