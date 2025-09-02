import type { EventHandler } from '@core/EventHandler.ts'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import type { Repository } from '@domain/Repository.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'
import { createUserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'

type UserCreatedEvent = ReturnType<typeof createUserCreatedEvent>

export class UserCreatedEventHandler implements EventHandler<UserCreatedEvent, Promise<void>> {
  constructor(
    private readonly repository: Repository<UserEvent, Promise<UserState>, Promise<void>>,
  ) { }

  start(eventBus: EventBus<UserEvent>): void {
    eventBus.subscribe('UserCreated', this)
  }

  async handle(anEvent: UserCreatedEvent): Promise<void> {
    const emailSentEvent = createUserRegistrationEmailSent(
      anEvent.aggregateId,
      { status: 'SUCCESS' },
      { causationId: anEvent.id },
    )

    await this.repository.store([emailSentEvent])
  }
}
