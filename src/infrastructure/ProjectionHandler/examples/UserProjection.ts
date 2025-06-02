import type { DomainEvent } from '../../../domain'
import type { UserCreatedPayload } from '../../../domain/DomainEvent/examples/UserCreated'
import type { UserNameUpdatedPayload } from '../../../domain/DomainEvent/examples/UserNameUpdated'
import type { Database } from '../../Database/Database'
import type { BaseEvent } from '../../EventBus/BaseEvent'
import type { IEventBus } from '../../EventBus/IEventBus'
import type { IProjectionHandler } from '../IProjectionHandler'
import { isDomainEvent } from '../../../domain'
import { Operation } from '../../Database/Database'

export class UserProjectionHandler implements IProjectionHandler<DomainEvent> {
  constructor(
    private eventBus: IEventBus,
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
