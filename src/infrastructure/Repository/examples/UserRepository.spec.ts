import type { DomainEvent } from '@domain/DomainEvent.js'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { EventStore } from '../../EventStore/EventStore.ts'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { makeStreamId } from '@utils/streamId/makeStreamId.js'
import { InMemoryEventStore } from '../../EventStore/implementations/InMemoryEventStore.ts'
import { UserRepository } from './UserRepository.ts'

describe('repository', () => {
  let eventStore: EventStore
  let event: DomainEvent<UserCreatedPayload>
  let repository: UserRepository

  beforeEach(async () => {
    eventStore = new InMemoryEventStore()
    event = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    repository = new UserRepository(eventStore)
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
