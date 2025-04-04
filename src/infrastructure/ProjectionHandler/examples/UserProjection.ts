import type { DomainEvent } from '../../../domain'
import type { UserCreatedPayload } from '../../../domain/DomainEvent/examples/UserCreated'
import type { UserNameUpdatedPayload } from '../../../domain/DomainEvent/examples/UserNameUpdated'
import { Operation } from '../../Database/Database'
import { ProjectionHandler } from '../ProjectionHandler'

export class UserProjectionHandler extends ProjectionHandler {
  start(): void {
    this.eventBus.subscribe(this)
  }

  async update(event: DomainEvent): Promise<void> {
    switch (event.type) {
      case 'UserCreated': {
        const user = { id: event.aggregateId, ...(event.payload as UserCreatedPayload) }
        await this.database.execute('users', { operation: Operation.CREATE, payload: user })
        break
      }
      case 'UserNameUpdated': {
        const updatePayload = { id: event.aggregateId, ...(event.payload as UserNameUpdatedPayload) }
        await this.database.execute('users', { operation: Operation.UPDATE, payload: updatePayload })
        break
      }
    }
  }
}
