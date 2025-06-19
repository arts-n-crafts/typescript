import type { DomainEvent } from '../../DomainEvent/DomainEvent'
import type { UserCreatedPayload } from '../../DomainEvent/examples/UserCreated'
import type { UserNameUpdatedPayload } from '../../DomainEvent/examples/UserNameUpdated'
import type { IAggregateRoot } from '../IAggregateRoot'
import { fail, invariant } from '../../../utils'
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

export class User extends AggregateRoot<UserProps> implements IAggregateRoot {
  private static readonly DEFAULT_PROPS: UserProps = {
    name: '',
    email: '',
    age: undefined,
    prospect: false,
  }

  constructor(id: string) {
    super(id, { ...User.DEFAULT_PROPS })
  }

  static override create(id: string, input: UserInputProps) {
    const event = UserCreated(id, input)
    const aggregate = User.fromEvents(id, [event])
    aggregate.addToUncommittedEvents(event)
    return aggregate
  }

  static override fromEvents(aggregateId: string, events: DomainEvent[]): User {
    invariant(!!events.length, fail(new Error('Cannot reconstruct User from empty event stream.')))
    invariant(events.at(0)?.type === 'UserCreated', fail(new TypeError('Invalid creation event found')))

    const aggregate = new User(aggregateId)
    events.forEach(event => aggregate.apply(event))

    invariant(
      aggregate.props.name !== User.DEFAULT_PROPS.name && aggregate.props.email !== User.DEFAULT_PROPS.email,
      fail(new Error('Rehydrated User properties still at default values. UserCreated event may be missing or invalid.')),
    )
    aggregate.markEventsCommitted()
    return aggregate
  }

  protected apply(event: DomainEvent): void {
    switch (event.type) {
      case 'UserCreated':
        this.props.name = (event as DomainEvent<UserCreatedPayload>).payload.name
        this.props.email = (event as DomainEvent<UserCreatedPayload>).payload.email
        this.props.age = (event as DomainEvent<UserCreatedPayload>).payload.age
        this.props.prospect = true
        break
      case 'UserNameUpdated':
        this.props.name = (event as DomainEvent<UserNameUpdatedPayload>).payload.name
        break
      case 'UserActivated':
        this.props.prospect = false
        break
      default:
        fail(new Error(`Unhandled event type: ${event.type}`))
    }
  }

  public changeName(name: string) {
    const event = UserNameUpdated(this.id, { name })
    this.apply(event)
    this.addToUncommittedEvents(event)
  }

  public activateUser() {
    const event = UserActivated(this.id, {})
    this.apply(event)
    this.addToUncommittedEvents(event)
  }
}
