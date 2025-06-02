import type { IEventStore } from '../EventStore/IEventStore'
import { User } from '../../domain/AggregateRoot/examples/User'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { UserRepository } from './examples/UserRepository'

describe('repository', () => {
  let newName: string
  let aggregateId: string
  let eventBus: EventBus
  let eventStore: IEventStore
  let aggregate: User

  beforeEach(() => {
    newName = 'musk'
    aggregateId = '123'
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    aggregate = User.create(aggregateId, { name: 'elon', email: 'elon@x.com' })
    aggregate.changeName(newName)
  })

  it('should be defined', () => {
    expect(UserRepository).toBeDefined()
  })

  it('should be able to store a new event from an aggregate', async () => {
    const repository = new UserRepository(eventStore, User)
    await repository.store(aggregate)
    const events = await eventStore.loadEvents(aggregateId)
    expect(events[1].type).toBe('UserNameUpdated')
    expect(events).toHaveLength(2)
  })

  it('should rehydrate the aggregate based on it\'s events', async () => {
    const repository = new UserRepository(eventStore, User)
    await repository.store(aggregate)
    const user = await repository.load(aggregateId)
    expect(user.props.name).toBe(newName)
  })
})
