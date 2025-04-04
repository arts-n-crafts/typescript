import type { DomainEvent } from '../DomainEvent/DomainEvent'
import type { UserProps } from './examples/User'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserCreated } from '../DomainEvent/examples/UserCreated'
import { UserNameUpdated } from '../DomainEvent/examples/UserNameUpdated'
import { createDomainEvent } from '../DomainEvent/utils/createDomainEvent'
import { AggregateRoot } from './AggregateRoot'
import { User } from './examples/User'

describe('aggregateRoot', () => {
  describe('properly implemented', () => {
    let id: string
    let props: UserProps
    let mockUserCreatedEvent: ReturnType<typeof UserCreated>
    let mockUserNameUpdatedEvent: ReturnType<typeof UserNameUpdated>
    let aggregateRoot: User

    beforeEach(() => {
      id = '123'
      props = { name: 'elon', email: 'elon@x.com' }
      mockUserCreatedEvent = UserCreated('123', props)
      mockUserNameUpdatedEvent = UserNameUpdated('123', { name: 'musk' })
      aggregateRoot = User.create(id, props)
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
      const unhandledEvent = createDomainEvent('UnhandledEvent', '4321', {})
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
      protected _applyEvent(_event: DomainEvent): void {
        throw new Error('Method not implemented.')
      }
    }

    it('should throw a "method not implemented" error if create static is not overridden', () => {
      expect(() => NotProperlyImplemented.create('1234', {})).toThrow('Method not implemented')
    })
    it('should throw a "method not implemented" error if rehydrate static is not overridden', () => {
      expect(() => NotProperlyImplemented.rehydrate('1234', [])).toThrow('Method not implemented')
    })
  })
})
