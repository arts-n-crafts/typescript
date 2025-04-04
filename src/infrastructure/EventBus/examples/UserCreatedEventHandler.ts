import type { DomainEvent } from '../../../domain/DomainEvent/DomainEvent'
import type { UserCreated } from '../../../domain/DomainEvent/examples/UserCreated'
import type { EventStore } from '../../EventStore/EventStore'
import { UserRegistrationEmailSent } from '../../../domain/DomainEvent/examples/UserRegistrationEmailSent'
import { EventHandler } from '../EventHandler'

export class UserCreatedEventHandler
  extends EventHandler<ReturnType<typeof UserCreated>> {
  constructor(
    private readonly eventStore: EventStore,
  ) {
    super()
  }

  async handle(event: DomainEvent<unknown>): Promise<void> {
    if (event.type === 'UserCreated') {
      const emailSentEvent = UserRegistrationEmailSent(
        event.aggregateId,
        { status: 'SUCCESS' },
        { causationId: event.id },
      )

      await this.eventStore.store(emailSentEvent)
    }
  }
}
