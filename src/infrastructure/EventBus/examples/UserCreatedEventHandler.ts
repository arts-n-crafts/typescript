import type { DomainEvent } from '../../../domain'
import type { UserCreatedPayload } from '../../../domain/DomainEvent/examples/UserCreated'
import type { IEventStore } from '../../EventStore/IEventStore'
import type { BaseEvent } from '../BaseEvent'
import type { IEventHandler } from '../IEventHandler'
import { isDomainEvent } from '../../../domain'
import { UserRegistrationEmailSent } from '../../../domain/DomainEvent/examples/UserRegistrationEmailSent'

export class UserCreatedEventHandler implements IEventHandler {
  constructor(
    private readonly eventStore: IEventStore,
  ) { }

  private isUserCreatedEvent(anEvent: BaseEvent): anEvent is DomainEvent<UserCreatedPayload> {
    return isDomainEvent(anEvent) && anEvent.type === 'UserCreated'
  }

  async handle(anEvent: BaseEvent): Promise<void> {
    if (this.isUserCreatedEvent(anEvent)) {
      const emailSentEvent = UserRegistrationEmailSent(
        anEvent.aggregateId,
        1,
        { status: 'SUCCESS' },
        { causationId: anEvent.id },
      )

      await this.eventStore.store(emailSentEvent)
    }
  }
}
