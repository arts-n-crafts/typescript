import type { EventStore } from '../EventStore/EventStore'
import { beforeEach, describe, expect, it } from 'vitest'
import { User } from '../../domain/AggregateRoot/examples/User'
import { UserNameUpdatedEvent } from '../../domain/DomainEvent/examples/UserNameUpdated'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { UserRepository } from './examples/UserRepository'

describe('repository', () => {
  let aggregateId: string
  let eventBus: EventBus
  let eventStore: EventStore
  let mockUserNameUpdateEvent: UserNameUpdatedEvent
  let aggregateRoot: User

  beforeEach(() => {
    aggregateId = '123'
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    mockUserNameUpdateEvent = new UserNameUpdatedEvent('123', { name: 'musk' })
    aggregateRoot = User.create({ name: 'elon', email: 'elon@x.com' }, aggregateId)
    aggregateRoot.apply(mockUserNameUpdateEvent)
  })

  it('should be defined', () => {
    expect(UserRepository).toBeDefined()
  })

  it('should be able to store a new event from an aggregate', async () => {
    const repository = new UserRepository(eventStore)
    await repository.store(aggregateRoot)
    const events = await eventStore.loadEvents(aggregateId)
    expect(events[1]).toStrictEqual(mockUserNameUpdateEvent)
    expect(events).toHaveLength(2)
  })

  it('should rehydrate the aggregate based on it\'s events', async () => {
    const repository = new UserRepository(eventStore)
    await repository.store(aggregateRoot)
    const aggregate = await repository.load(aggregateId)
    expect(aggregate.props.name).toBe(mockUserNameUpdateEvent.payload.name)
  })
})
