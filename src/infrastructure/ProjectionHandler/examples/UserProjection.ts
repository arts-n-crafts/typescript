import type { DomainEvent } from '../../../domain/DomainEvent/DomainEvent'
import type { UserCreatedEventProps } from '../../../domain/DomainEvent/examples/UserCreated'
import type { UserNameUpdatedEventProps } from '../../../domain/DomainEvent/examples/UserNameUpdated'
import { UserCreatedEvent } from '../../../domain/DomainEvent/examples/UserCreated'
import { UserNameUpdatedEvent } from '../../../domain/DomainEvent/examples/UserNameUpdated'
import { Operation } from '../../Database/Database'
import { ProjectionHandler } from '../ProjectionHandler'

export class UserProjectionHandler extends ProjectionHandler {
  start(): void {
    this.eventBus.subscribe(this)
  }

  async update<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    switch (event.constructor.name) {
      case UserCreatedEvent.name: {
        const user = { id: event.aggregateId, ...(event as DomainEvent<UserCreatedEventProps>).payload }
        await this.database.execute('users', { operation: Operation.CREATE, payload: user })
        break
      }
      case UserNameUpdatedEvent.name: {
        const updatePayload = { id: event.aggregateId, name: (event as DomainEvent<UserNameUpdatedEventProps>).payload.name }
        await this.database.execute('users', { operation: Operation.UPDATE, payload: updatePayload })
        break
      }
    }
  }
}
