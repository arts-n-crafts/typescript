import type { EventHandler } from '@core/EventHandler.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import { UserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'

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
