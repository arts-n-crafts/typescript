import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import { randomUUID } from 'node:crypto'
import { User } from '@domain/examples/User.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { GenericEventStore } from '../../EventStore/implementations/GenericEventStore.ts'
import { UserRepository } from './UserRepository.ts'

describe('repository', () => {
  let database: Database
  let eventStore: GenericEventStore
  let event: DomainEvent<UserCreatedPayload>
  let repository: UserRepository

  beforeEach(async () => {
    database = new InMemoryDatabase()
    eventStore = new GenericEventStore(database)
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
