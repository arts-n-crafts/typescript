import type { DomainEvent } from '../../DomainEvent/DomainEvent'
import type { UserCreatedPayload } from '../../DomainEvent/examples/UserCreated'
import type { UserNameUpdatedPayload } from '../../DomainEvent/examples/UserNameUpdated'
import { UserCreated } from '../../DomainEvent/examples/UserCreated'
import { AggregateRoot } from '../AggregateRoot'

export interface UserProps {
  name: string
  email: string
  age?: number
}

export class User extends AggregateRoot<UserProps> {
  static override create(id: string, props: UserProps) {
    const aggregate = new User(id, props)
    aggregate.apply(UserCreated(id, props))
    return aggregate
  }

  static override rehydrate(aggregateId: string, events: DomainEvent[]): User {
    const creationEvent = events.shift()
    if (!(creationEvent && creationEvent.type === 'UserCreated')) {
      throw new TypeError('Invalid creation event found')
    }
    const aggregate = new User(aggregateId, (creationEvent as DomainEvent<UserCreatedPayload>).payload)
    events.forEach(event => aggregate._applyEvent(event))
    return aggregate
  }

  protected _applyEvent(event: DomainEvent): void {
    if (event.type === 'UserNameUpdated') {
      this.props.name = (event as DomainEvent<UserNameUpdatedPayload>).payload.name
    }
  }
}
