import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { User } from '@domain/examples/User.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { SimpleRepository } from './SimpleRepository.ts'

describe('simple repository', () => {
  const streamName = 'users'
  let database: Database<StoredEvent<UserEvent>>
  let eventStore: EventStore<UserEvent>
  let repository: Repository<UserEvent, UserState>

  const createCommand = createRegisterUserCommand(randomUUID(), { name: 'Elon', email: 'elon@x.com' })

  beforeEach(() => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new SimpleRepository(eventStore, streamName, User.evolve, User.initialState)
  })

  it('should be defined', () => {
    expect(SimpleRepository).toBeDefined()
  })

  it('should store the decider user event', async () => {
    const pastEvents: UserEvent[] = []
    const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

    const events = User.decide(createCommand, currentState)
    const result = await repository.store(events)
    expect(result).toBeUndefined()
  })
  it('should load the current user state', async () => {
    const pastEvents: UserEvent[] = []
    const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

    const events = User.decide(createCommand, currentState)
    await repository.store(events)
    const userState = await repository.load(createCommand.aggregateId)
    expect(userState).toStrictEqual({
      ...events[0].payload,
      id: createCommand.aggregateId,
    })
  })
})
