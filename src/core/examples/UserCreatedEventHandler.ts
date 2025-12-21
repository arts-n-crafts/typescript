import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.js'
import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import type { Repository } from '@domain/Repository.ts'
import { createUserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'

type UserCreatedEvent = ReturnType<typeof createUserCreatedEvent>

export class UserCreatedEventHandler implements EventHandler<UserCreatedEvent, Promise<void>> {
  constructor(
    private readonly repository: Repository<UserEvent, Promise<UserState>, Promise<void>>,
  ) { }

  isUserCreatedEvent(anEvent: BaseEvent): anEvent is UserCreatedEvent {
    return anEvent.type === 'UserCreated'
  }

  async handle(anEvent: BaseEvent): Promise<void> {
    if (this.isUserCreatedEvent(anEvent)) {
      const emailSentEvent = createUserRegistrationEmailSent(
        anEvent.aggregateId,
        { status: 'SUCCESS' },
        { causationId: anEvent.id },
      )

      await this.repository.store([emailSentEvent])
    }
  }
}
