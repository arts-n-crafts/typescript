import type { EventHandler } from '@core/EventHandler.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreated } from '@domain/examples/UserCreated.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import { UserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'

type UserCreatedEvent = ReturnType<typeof UserCreated>

export class UserCreatedEventHandler implements EventHandler<UserCreatedEvent> {
  constructor(
    private readonly eventStore: EventStore<UserEvent>,
  ) { }

  async handle(anEvent: UserCreatedEvent): Promise<void> {
    const emailSentEvent = UserRegistrationEmailSent(
      anEvent.aggregateId,
      { status: 'SUCCESS' },
      { causationId: anEvent.id },
    )

    await this.eventStore.store(emailSentEvent)
  }
}
