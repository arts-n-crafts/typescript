import type { DomainEvent } from '../../DomainEvent/DomainEvent'
import type { UserCreatedPayload } from '../../DomainEvent/examples/UserCreated'
import type { UserNameUpdatedPayload } from '../../DomainEvent/examples/UserNameUpdated'
import { UserActivated } from '../../DomainEvent/examples/UserActivated'
import { UserCreated } from '../../DomainEvent/examples/UserCreated'
import { UserNameUpdated } from '../../DomainEvent/examples/UserNameUpdated'
import { AggregateRoot } from '../AggregateRoot'

export interface UserInputProps {
  name: string
  email: string
  age?: number
}

export interface UserProps extends UserInputProps {
  prospect: boolean
}

export class User extends AggregateRoot<UserProps> {
  protected sequenceNumber: number = 0

  static override create(id: string, input: UserInputProps) {
    const props = { ...input, prospect: true }
    const aggregate = new User(id, props)
    aggregate.apply(UserCreated(id, 1, props))
    return aggregate
  }

  static override rehydrate(aggregateId: string, events: DomainEvent[]): User {
    const creationEvent = events.shift()
    if (!(creationEvent && creationEvent.type === 'UserCreated')) {
      throw new TypeError('Invalid creation event found')
    }
    const aggregate = new User(aggregateId, (creationEvent as DomainEvent<UserCreatedPayload>).payload)
    events.forEach(event => aggregate.applyEvent(event))
    return aggregate
  }

  protected applyEvent(event: DomainEvent): void {
    if (event.type === 'UserNameUpdated') {
      this.props.name = (event as DomainEvent<UserNameUpdatedPayload>).payload.name
    }
    if (event.type === 'UserActivated') {
      this.props.prospect = false
    }
    this.sequenceNumber = event.sequenceNumber
  }

  public changeName(name: string) {
    this.apply(UserNameUpdated(this.id, this.nextSequenceNumber, { name }))
  }

  public activateUser() {
    this.apply(UserActivated(this.id, this.nextSequenceNumber, {}))
  }
}
