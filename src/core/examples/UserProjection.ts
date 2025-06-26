import type { ProjectionHandler } from '@core/ProjectionHandler.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { UserNameUpdatedPayload } from '@domain/examples/UserNameUpdated.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { Operation } from '@infrastructure/Database/Database.ts'

export class UserProjectionHandler implements ProjectionHandler<UserEvent> {
  constructor(
    private eventBus: EventBus<UserEvent>,
    private database: Database,
  ) { }

  start(): void {
    this.eventBus.subscribe('UserCreated', this)
    this.eventBus.subscribe('UserNameUpdated', this)
  }

  async handle(anEvent: unknown): Promise<void> {
    if (isDomainEvent(anEvent) && anEvent.type === 'UserCreated') {
      const user = { id: anEvent.aggregateId, ...(anEvent.payload as UserCreatedPayload) }
      await this.database.execute('users', { operation: Operation.CREATE, payload: user })
    }
    if (isDomainEvent(anEvent) && anEvent.type === 'UserNameUpdated') {
      const updatePayload = { id: anEvent.aggregateId, ...(anEvent.payload as UserNameUpdatedPayload) }
      await this.database.execute('users', { operation: Operation.UPDATE, payload: updatePayload })
    }
  }
}
