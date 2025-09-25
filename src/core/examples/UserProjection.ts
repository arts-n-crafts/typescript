import type { EventHandler } from '@core/EventHandler.ts'
import type { WithIdentifier } from '@core/types/WithIdentifier.ts'
import type { BaseEvent } from '@domain/BaseEvent.js'
import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedEvent, UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { UserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.js'
import type { Database, PatchStatement } from '@infrastructure/Database/Database.ts'
import { Operation } from '@infrastructure/Database/Database.ts'

export type UserModel = WithIdentifier<UserCreatedPayload>

export class UserProjectionHandler implements EventHandler<UserEvent> {
  constructor(
    private database: Database<UserModel, Promise<void>, Promise<UserModel[]>>,
  ) { }

  isUserCreatedEvent(anEvent: BaseEvent): anEvent is UserCreatedEvent {
    return anEvent.type === 'UserCreated'
  }

  isUserNameUpdatedEvent(anEvent: BaseEvent): anEvent is UserNameUpdatedEvent {
    return anEvent.type === 'UserNameUpdated'
  }

  async handle(anEvent: UserEvent): Promise<void> {
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
