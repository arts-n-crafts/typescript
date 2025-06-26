import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { AllEvents } from '@infrastructure/ScenarioTest/examples/User.module.ts'
import type { EventBus } from '../../EventBus/EventBus.ts'
import type { EventStore } from '../../EventStore/EventStore.ts'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryEventBus } from '../../EventBus/implementations/InMemoryEventBus.ts'
import { InMemoryEventStore } from '../../EventStore/implementations/InMemoryEventStore.ts'
import { UserRepository } from './UserRepository.ts'

describe('repository', () => {
  let eventBus: EventBus<AllEvents>
  let eventStore: EventStore<UserEvent>
  let aggregateId: string
  let payload: UserCreatedPayload

  beforeEach(() => {
    aggregateId = '123'
    eventBus = new InMemoryEventBus<AllEvents>()
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
