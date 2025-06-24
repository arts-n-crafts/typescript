import type { DomainEvent } from '../../domain'
import type { UserEvent } from '../../domain/examples/User'
import type { UserCreatedPayload } from '../../domain/examples/UserCreated'
import type { EventStore } from '../../infrastructure'
import type { EventHandler } from '../EventHandler'
import { isDomainEvent } from '../../domain'
import { UserRegistrationEmailSent } from '../../domain/examples/UserRegistrationEmailSent'

export class UserCreatedEventHandler implements EventHandler<DomainEvent<UserCreatedPayload>> {
  constructor(
    private readonly eventStore: EventStore<UserEvent>,
  ) { }

  private isUserCreatedEvent(anEvent: unknown): anEvent is DomainEvent<UserCreatedPayload> {
    return isDomainEvent(anEvent) && anEvent.type === 'UserCreated'
  }

  async handle(anEvent: unknown): Promise<void> {
    if (this.isUserCreatedEvent(anEvent)) {
      const emailSentEvent = UserRegistrationEmailSent(
        anEvent.aggregateId,
        { status: 'SUCCESS' },
        { causationId: anEvent.id },
      )

      await this.eventStore.store(emailSentEvent)
    }
  }
}
