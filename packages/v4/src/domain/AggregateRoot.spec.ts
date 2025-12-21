import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { User as UserEventBased } from './examples/User.eventBased.ts'
import { User as UserStateBased } from './examples/User.stateBased.ts'

const id: string = randomUUID()
const props = { email: 'john@doe.com', name: 'John Doe' }

describe('aggregate root', () => {
  describe('state-based AggregateRoot', () => {
    const user = new UserStateBased(id, props)

    it('should be identifiable, have properties, and an outbox', () => {
      expect(user.id).toBe(id)
      expect(user.props).toStrictEqual(props)
      expect(user.uncommittedEvents).toHaveLength(1)
      expect(user.uncommittedEvents[0].type).toBe('UserCreated')
    })

    it('should be able to update the name', () => {
      user.updateName('Jack Doe')
      expect(user.props.name).toBe('Jack Doe')
      expect(user.uncommittedEvents).toHaveLength(2)
      expect(user.uncommittedEvents[1].type).toBe('UserNameUpdated')
    })
  })

  describe('event-based AggregateRoot', () => {
    const userCreatedEvent = createUserCreatedEvent(id, props)
    const userNameUpdatedEvent = createUserNameUpdatedEvent(userCreatedEvent.aggregateId, { name: 'Jack Doe' })
    const user = new UserEventBased(userCreatedEvent)

    it('should be in state after creation', () => {
      expect(user.id).toBe(userCreatedEvent.aggregateId)
      expect(user.props).toBe(userCreatedEvent.payload)
      expect(user.uncommittedEvents).toStrictEqual([])
      expect(user).toHaveProperty('fromEvents')
    })

    it('should rehydrate to current state', () => {
      user.fromEvents([userNameUpdatedEvent])
      expect(user.uncommittedEvents).toStrictEqual([])
      expect(user.props.name).toBe('Jack Doe')
    })
  })
})
