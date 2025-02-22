import type { DomainEvent } from '../../../domain/DomainEvent/DomainEvent'
import type { MockUserCreatedEventProps } from '../../../domain/DomainEvent/mocks/MockUserCreated'
import type { MockUserNameUpdatedEventProps } from '../../../domain/DomainEvent/mocks/MockUserNameUpdated'
import { MockUserCreatedEvent } from '../../../domain/DomainEvent/mocks/MockUserCreated'
import { MockUserNameUpdatedEvent } from '../../../domain/DomainEvent/mocks/MockUserNameUpdated'
import { Operation } from '../../Database/Database'
import { ProjectionHandler } from '../ProjectionHandler'

export class MockUserProjectionHandler extends ProjectionHandler {
  start(): void {
    this.eventBus.subscribe(this)
  }

  async update<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    switch (event.constructor.name) {
      case MockUserCreatedEvent.name: {
        const user = { id: event.aggregateId, ...(event as DomainEvent<MockUserCreatedEventProps>).payload }
        await this.database.execute('users', { operation: Operation.CREATE, payload: user })
        break
      }
      case MockUserNameUpdatedEvent.name: {
        const updatePayload = { id: event.aggregateId, name: (event as DomainEvent<MockUserNameUpdatedEventProps>).payload.name }
        await this.database.execute('users', { operation: Operation.UPDATE, payload: updatePayload })
        break
      }
    }
  }
}
