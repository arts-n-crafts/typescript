import type { UserEvent } from '../../../domain/examples/User'
import type { UserCreatedPayload } from '../../../domain/examples/UserCreated'
import type { EventBus } from '../../EventBus/EventBus'
import type { EventStore } from '../../EventStore/EventStore'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '../../../domain/examples/UserCreated'
import { InMemoryEventBus } from '../../EventBus/implementations/InMemoryEventBus'
import { InMemoryEventStore } from '../../EventStore/implementations/InMemoryEventStore'
import { UserRepository } from './UserRepository'

describe('repository', () => {
  let eventBus: EventBus<UserEvent>
  let eventStore: EventStore<UserEvent>
  let aggregateId: string
  let payload: UserCreatedPayload

  beforeEach(() => {
    aggregateId = '123'
    eventBus = new InMemoryEventBus<UserEvent>()
    eventStore = new InMemoryEventStore<UserEvent>(eventBus)
    aggregateId = randomUUID()
    payload = { name: 'test', email: 'musk@x.com', prospect: true }
  })

  it('should be defined', () => {
    expect(UserRepository).toBeDefined()
  })

  it('should be able to store the new event', async () => {
    const createdEvent = UserCreated(aggregateId, payload)
    const repository = new UserRepository(eventStore)
    await repository.store([createdEvent])

    const events = await eventStore.loadEvents(aggregateId)
    expect(events[0].type).toBe('UserCreated')
    expect(events).toHaveLength(1)
  })
})
