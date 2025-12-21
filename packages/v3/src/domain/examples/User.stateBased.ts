import type { AggregateRoot } from '@domain/AggregateRoot.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'

interface UserProps {
  name: string
  email: string
}

export class User implements AggregateRoot<string, UserProps, UserEvent> {
  private readonly _id: string
  private readonly _props: UserProps
  private readonly outbox: UserEvent[] = []

  constructor(id: string, props: UserProps) {
    this._id = id
    this._props = props
    const event = createUserCreatedEvent(id, props)
    this.outbox.push(event)
  }

  get id(): string {
    return this._id
  }

  get props(): UserProps {
    return this._props
  }

  get uncommittedEvents(): UserEvent[] {
    return this.outbox
  }

  updateName(name: string): void {
    this._props.name = name
    const event = createUserNameUpdatedEvent(this.id, { name })
    this.outbox.push(event)
  }
}
