import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { DomainEvent } from '@domain/DomainEvent.js'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.js'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryEventBus } from '@infrastructure/EventBus/implementations/InMemoryEventBus.js'
import { makeStreamId } from '@utils/streamId/makeStreamId.js'
import { InMemoryEventStore } from '../../EventStore/implementations/InMemoryEventStore.ts'
import { UserRepository } from './UserRepository.ts'

describe('repository', () => {
  let eventBus: EventBus<BaseEvent<unknown>>
  let eventStore: InMemoryEventStore
  let event: DomainEvent<UserCreatedPayload>
  let repository: UserRepository

  beforeEach(async () => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore()
    event = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    repository = new UserRepository(eventStore, eventBus)
    await repository.store([event])
  })

  it('should be defined', () => {
    expect(UserRepository).toBeDefined()
  })

  it('should contain the stored events', async () => {
    const streamId = makeStreamId(repository.stream, event.aggregateId)
    const events = await eventStore.load(streamId)
    expect(events[0].type).toBe('UserCreated')
    expect(events).toHaveLength(1)
  })

  it('should have 0 events in non-existent streamId', async () => {
    const streamId = makeStreamId(repository.stream, randomUUID())

    const events = await eventStore.load(streamId)
    expect(events).toHaveLength(0)
  })
})
