import type { DomainEvent } from '../../../domain/DomainEvent/DomainEvent'
import type { UserCreatedPayload } from '../../../domain/DomainEvent/examples/UserCreated'
import type { EventStore } from '../../EventStore/EventStore'
import { UserRegistrationEmailSent } from '../../../domain/DomainEvent/examples/UserRegistrationEmailSent'
import { EventHandler } from '../EventHandler'

type EventType = DomainEvent<UserCreatedPayload>

export class UserCreatedEventHandler extends EventHandler<EventType> {
  constructor(
    private readonly eventStore: EventStore,
  ) {
    super()
  }

  async handle(event: EventType): Promise<void> {
    if (event.type === 'UserCreated') {
      const emailSentEvent = UserRegistrationEmailSent(
        event.aggregateId,
        1,
        { status: 'SUCCESS' },
        { causationId: event.id },
      )

      await this.eventStore.store(emailSentEvent)
    }
  }
}
