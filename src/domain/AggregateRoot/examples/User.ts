import type { DomainEvent } from '../../DomainEvent/DomainEvent'
import { UserCreatedEvent } from '../../DomainEvent/examples/UserCreated'
import { UserNameUpdatedEvent } from '../../DomainEvent/examples/UserNameUpdated'
import { AggregateRoot } from '../AggregateRoot'

export interface UserProps {
  name: string
  email: string
  age?: number
}

export class User extends AggregateRoot<UserProps> {
  static override create(props: UserProps, id: string) {
    const aggregate = new User(props, id)
    aggregate.apply(new UserCreatedEvent(id, props))
    return aggregate
  }

  static override rehydrate(aggregateId: string, events: DomainEvent<unknown>[]): User {
    const creationEvent = events.shift()
    if (!(creationEvent instanceof UserCreatedEvent)) {
      throw new TypeError('Invalid creation event found')
    }
    const aggregate = new User(creationEvent.payload, aggregateId)
    events.forEach(event => aggregate._applyEvent(event))
    return aggregate
  }

  protected _applyEvent(event: DomainEvent<unknown>): void {
    if (event instanceof UserNameUpdatedEvent) {
      this.props.name = event.payload.name
    }
  }
}
