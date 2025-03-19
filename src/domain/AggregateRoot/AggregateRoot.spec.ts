import type { UserProps } from './examples/User'
import { beforeEach, describe, expect, it } from 'vitest'
import { DomainEvent } from '../DomainEvent/DomainEvent'
import { UserCreatedEvent } from '../DomainEvent/examples/UserCreated'
import { UserNameUpdatedEvent } from '../DomainEvent/examples/UserNameUpdated'
import { AggregateRoot } from './AggregateRoot'
import { User } from './examples/User'

describe('aggregateRoot', () => {
  describe('properly implemented', () => {
    let id: string
    let props: UserProps
    let mockUserCreatedEvent: UserCreatedEvent
    let mockUserNameUpdatedEvent: UserNameUpdatedEvent
    let aggregateRoot: User

    beforeEach(() => {
      id = '123'
      props = { name: 'elon', email: 'elon@x.com' }
      mockUserCreatedEvent = new UserCreatedEvent('123', props)
      mockUserNameUpdatedEvent = new UserNameUpdatedEvent('123', { name: 'musk' })
      aggregateRoot = User.create(props, id)
    })

    it('should be defined', () => {
      expect(AggregateRoot).toBeDefined()
    })

    it('should apply the event given', () => {
      aggregateRoot.apply(mockUserNameUpdatedEvent)
      expect(aggregateRoot.props.name).toBe('musk')
    })

    it('should push to uncommittedEvents', () => {
      aggregateRoot.apply(mockUserNameUpdatedEvent)
      expect(aggregateRoot.uncommittedEvents[1]).toStrictEqual(mockUserNameUpdatedEvent)
    })

    it('should mark events as committed by clearing uncommittedEvents', () => {
      aggregateRoot.apply(mockUserNameUpdatedEvent)
      expect(aggregateRoot.uncommittedEvents[1]).toStrictEqual(mockUserNameUpdatedEvent)
      aggregateRoot.markEventsCommitted()
      expect(aggregateRoot.uncommittedEvents).toStrictEqual([])
    })

    it('should do nothing on an unhandled event', () => {
      class UnhandledEvent extends DomainEvent<Record<string, unknown>> { }
      const unhandledEvent = new UnhandledEvent('4321', {})
      aggregateRoot.apply(unhandledEvent)
      expect(aggregateRoot.props.name).toBe('elon')
    })

    it('should rehydrate events', () => {
      const aggregate = User.rehydrate(id, [mockUserCreatedEvent, mockUserNameUpdatedEvent])
      expect(aggregate.props.name).toBe('musk')
    })

    it('should not rehydrate if there is no creation event', () => {
      expect(() => User.rehydrate(id, [mockUserNameUpdatedEvent])).toThrow()
    })
  })

  describe('not properly implemented', () => {
    class NotProperlyImplemented extends AggregateRoot<UserProps> {
      protected _applyEvent(_event: DomainEvent<unknown>): void {
        throw new Error('Method not implemented.')
      }
    }

    it('should throw a "method not implemented" error if create static is not overridden', () => {
      expect(() => NotProperlyImplemented.create({}, '1234')).toThrow('Method not implemented')
    })
    it('should throw a "method not implemented" error if rehydrate static is not overridden', () => {
      expect(() => NotProperlyImplemented.rehydrate('1234', [])).toThrow('Method not implemented')
    })
  })
})
