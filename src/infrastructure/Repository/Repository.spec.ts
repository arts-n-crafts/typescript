import type { EventStore } from '../EventStore/EventStore'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockUser } from '../../domain/AggregateRoot/mocks/MockUser'
import { MockUserNameUpdatedEvent } from '../../domain/DomainEvent/mocks/MockUserNameUpdated'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { MockUserRepository } from './mocks/MockUserRepository'

describe('repository', () => {
  let aggregateId: string
  let eventBus: EventBus
  let eventStore: EventStore
  let mockUserNameUpdateEvent: MockUserNameUpdatedEvent
  let aggregateRoot: MockUser

  beforeEach(() => {
    aggregateId = '123'
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    mockUserNameUpdateEvent = new MockUserNameUpdatedEvent('123', { name: 'musk' })
    aggregateRoot = MockUser.create({ name: 'elon', email: 'elon@x.com' }, aggregateId)
    aggregateRoot.apply(mockUserNameUpdateEvent)
  })

  it('should be defined', () => {
    expect(MockUserRepository).toBeDefined()
  })

  it('should be able to store a new event from an aggregate', async () => {
    const repository = new MockUserRepository(eventStore)
    await repository.store(aggregateRoot)
    const events = await eventStore.loadEvents(aggregateId)
    expect(events[1]).toStrictEqual(mockUserNameUpdateEvent)
    expect(events).toHaveLength(2)
  })

  it('should rehydrate the aggregate based on it\'s events', async () => {
    const repository = new MockUserRepository(eventStore)
    await repository.store(aggregateRoot)
    const aggregate = await repository.load(aggregateId)
    expect(aggregate.props.name).toBe(mockUserNameUpdateEvent.payload.name)
  })
})
