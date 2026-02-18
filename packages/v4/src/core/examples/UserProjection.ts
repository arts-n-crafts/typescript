import type { EventHandler } from '@core/EventHandler.ts'
import type { WithIdentifier } from '@core/types/WithIdentifier.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedEvent, UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { UserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import type { Database, PatchStatement } from '@infrastructure/Database/Database.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { Operation } from '@infrastructure/Database/Database.ts'

export type UserModel = WithIdentifier<UserCreatedPayload>

export class UserProjectionHandler implements EventHandler<UserEvent> {
  constructor(
    private readonly database: Database<UserModel, Promise<void>, Promise<UserModel[]>>,
  ) {}

  isUserCreatedEvent(anEvent: DomainEvent | IntegrationEvent | ExternalEvent): anEvent is UserCreatedEvent {
    return isDomainEvent(anEvent) && anEvent.type === 'UserCreated'
  }

  isUserNameUpdatedEvent(anEvent: DomainEvent | IntegrationEvent | ExternalEvent): anEvent is UserNameUpdatedEvent {
    return isDomainEvent(anEvent) && anEvent.type === 'UserNameUpdated'
  }

  async handle(anEvent: DomainEvent | IntegrationEvent | ExternalEvent): Promise<void> {
    if (this.isUserCreatedEvent(anEvent)) {
      const user = { id: anEvent.aggregateId, ...anEvent.payload }
      await this.database.execute('users', { operation: Operation.CREATE, payload: user })
    }
    if (this.isUserNameUpdatedEvent(anEvent)) {
      const updatePayload = { id: anEvent.aggregateId, ...anEvent.payload }
      const statement: PatchStatement<UserModel> = { operation: Operation.PATCH, payload: updatePayload }
      await this.database.execute('users', statement)
    }
  }
}
