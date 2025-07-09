import type { EventHandler } from '@core/EventHandler.ts'
import type { UserEvent } from '@domain/examples/User.js'
import type { UserCreated } from '@domain/examples/UserCreated.ts'
import type { Repository } from '@domain/Repository.js'
import { UserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'

type UserCreatedEvent = ReturnType<typeof UserCreated>

export class UserCreatedEventHandler implements EventHandler<UserCreatedEvent> {
  constructor(
    private readonly repository: Repository<UserEvent>,
  ) { }

  async handle(anEvent: UserCreatedEvent): Promise<void> {
    const emailSentEvent = UserRegistrationEmailSent(
      anEvent.aggregateId,
      { status: 'SUCCESS' },
      { causationId: anEvent.id },
    )

    await this.repository.store([emailSentEvent])
  }
}
