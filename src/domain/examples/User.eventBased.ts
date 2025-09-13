import type { EventBasedAggregateRoot } from '@domain/AggregateRoot.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'

interface UserProps {
  name: string
  email: string
}

export class User implements EventBasedAggregateRoot<string, UserProps, UserEvent> {
  private readonly _id: string
  private readonly outbox: UserEvent[] = []

  constructor(event: DomainEvent<UserCreatedPayload>) {
    this._id = event.aggregateId
    this._props = event.payload
  }

  private _props: UserProps

  get props(): UserProps {
    return this._props
  }

  get id(): string {
    return this._id
  }

  get uncommittedEvents(): UserEvent[] {
    return this.outbox
  }

  fromEvents = (events: UserEvent[]): void => {
    events.forEach((e: UserEvent) => this.apply(e))
  }

  private apply(event: UserEvent): void {
    switch (event.type) {
      case 'UserNameUpdated': {
        this._props = { ...this._props, ...event.payload }
      }
    }
  }
}
