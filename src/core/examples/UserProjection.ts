import type { BaseEvent } from '../../domain/BaseEvent.ts'
import type { UserEvent } from '../../domain/examples/User.ts'
import type { UserCreatedPayload } from '../../domain/examples/UserCreated.ts'
import type { UserNameUpdatedPayload } from '../../domain/examples/UserNameUpdated.ts'
import type { Database, EventBus } from '../../infrastructure'
import type { ProjectionHandler } from '../ProjectionHandler.ts'
import { isDomainEvent } from '../../domain'
import { Operation } from '../../infrastructure'

export class UserProjectionHandler implements ProjectionHandler<UserEvent> {
  constructor(
    private eventBus: EventBus<UserEvent>,
    private database: Database,
  ) { }

  start(): void {
    this.eventBus.subscribe(this)
  }

  async handle(anEvent: BaseEvent): Promise<void> {
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
