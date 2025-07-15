import type { DomainEvent } from '@domain/DomainEvent.js'
import type { UserEvent } from '@domain/examples/User.js'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import { randomUUID } from 'node:crypto'
import { User } from '@domain/examples/User.js'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryEventStore } from '../../EventStore/implementations/InMemoryEventStore.ts'
import { UserRepository } from './UserRepository.ts'

describe('repository', () => {
  let eventStore: EventStore<UserEvent>
  let event: DomainEvent<UserCreatedPayload>
  let repository: UserRepository

  beforeEach(async () => {
    eventStore = new InMemoryEventStore()
    event = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    repository = new UserRepository(eventStore, 'users', User.evolve, User.initialState)
    await repository.store([event])
  })

  it('should be defined', () => {
    expect(UserRepository).toBeDefined()
  })

  it('should contain the stored events', async () => {
    const state = await repository.load(event.aggregateId)
    expect(state.name).toBe(event.payload.name)
  })
})
