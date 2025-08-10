import type { ProjectionHandler } from '@core/ProjectionHandler.ts'
import type { WithIdentifier } from '@core/types/WithIdentifier.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { Database, PatchStatement } from '@infrastructure/Database/Database.ts'
import type { SimpleDatabaseResult } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { Operation } from '@infrastructure/Database/Database.ts'

export type UserModel = UserCreatedPayload & WithIdentifier

export class UserProjectionHandler implements ProjectionHandler {
  constructor(
    private eventBus: EventBus,
    private database: Database<UserModel, SimpleDatabaseResult>,
  ) { }

  start(): void {
    this.eventBus.subscribe('UserCreated', this)
    this.eventBus.subscribe('UserNameUpdated', this)
  }

  async handle(anEvent: UserEvent): Promise<void> {
    if (isDomainEvent(anEvent) && anEvent.type === 'UserCreated') {
      const user = { id: anEvent.aggregateId, ...(anEvent.payload as UserCreatedPayload) }
      await this.database.execute('users', { operation: Operation.CREATE, payload: user })
    }
    if (isDomainEvent(anEvent) && anEvent.type === 'UserNameUpdated') {
      const updatePayload = { id: anEvent.aggregateId, ...(anEvent.payload) }
      const statement: PatchStatement<UserModel> = { operation: Operation.PATCH, payload: updatePayload }
      await this.database.execute('users', statement)
    }
  }
}
