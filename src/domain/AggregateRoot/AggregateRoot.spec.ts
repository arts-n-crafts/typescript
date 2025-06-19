import type { DomainEvent } from '../DomainEvent/DomainEvent'
import type { UserProps } from './examples/User'
import { UserCreated } from '../DomainEvent/examples/UserCreated'
import { UserNameUpdated } from '../DomainEvent/examples/UserNameUpdated'
import { AggregateRoot } from './AggregateRoot'
import { User } from './examples/User'

describe('aggregateRoot', () => {
  it('should be defined', () => {
    expect(AggregateRoot).toBeDefined()
  })

  describe('properly implemented', () => {
    let id: string
    let props: UserProps
    let mockUserCreatedEvent: ReturnType<typeof UserCreated>
    let mockUserNameUpdatedEvent: ReturnType<typeof UserNameUpdated>
    let aggregate: User

    beforeEach(() => {
      id = '123'
      props = { name: 'elon', email: 'elon@x.com', prospect: true }
      mockUserCreatedEvent = UserCreated('123', props)
      mockUserNameUpdatedEvent = UserNameUpdated('123', { name: 'musk' })
      aggregate = User.create(id, props)
    })

    it('should apply the event given', () => {
      aggregate.changeName('musk')
      expect(aggregate.props.name).toBe('musk')
    })

    it('should push to uncommittedEvents', () => {
      aggregate.changeName('musk')
      expect(aggregate.uncommittedEvents[1].type).toBe('UserNameUpdated')
    })

    it('should mark events as committed by clearing uncommittedEvents', () => {
      aggregate.changeName('musk')
      expect(aggregate.uncommittedEvents[1].type).toBe('UserNameUpdated')
      aggregate.markEventsCommitted()
      expect(aggregate.uncommittedEvents).toStrictEqual([])
    })

    it('should rehydrate events', () => {
      const aggregate = User.fromEvents(id, [mockUserCreatedEvent, mockUserNameUpdatedEvent])
      expect(aggregate.props.name).toBe('musk')
    })

    it('should not rehydrate if there is no creation event', () => {
      expect(() => User.fromEvents(id, [mockUserNameUpdatedEvent])).toThrow()
    })
  })

  describe('not properly implemented', () => {
    class NotProperlyImplemented extends AggregateRoot<UserProps> {
      protected apply(_event: DomainEvent): void {
        throw new Error('Method not implemented.')
      }
    }

    it('should throw a "method not implemented" error if create static is not overridden', () => {
      expect(() => NotProperlyImplemented.create('1234', {})).toThrow('Method not implemented')
    })
    it('should throw a "method not implemented" error if rehydrate static is not overridden', () => {
      expect(() => NotProperlyImplemented.fromEvents('1234', [])).toThrow('Method not implemented')
    })
  })
})
