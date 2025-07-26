import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { ResultedEventStoreAppendReturnType } from '@infrastructure/EventStore/implementations/ResultedEventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { Result } from 'oxide.ts'
import type { ResultedRepositoryResult } from './ResultedRepository.ts'
import { randomUUID } from 'node:crypto'
import { CreateUser } from '@core/examples/CreateUser.ts'
import { User } from '@domain/examples/User.ts'
import { ResultedDatabase } from '@infrastructure/Database/implementations/ResultedDatabase.ts'
import { ResultedEventStore } from '@infrastructure/EventStore/implementations/ResultedEventStore.ts'
import { ResultedRepository } from './ResultedRepository.ts'

describe('resulted repository', () => {
  const streamName = 'users'
  let database: Database<StoredEvent<UserEvent>, ResultedEventStoreAppendReturnType, Result<StoredEvent<UserEvent>[], Error>>
  let eventStore: EventStore<UserEvent, ResultedEventStoreAppendReturnType, Result<UserEvent[], Error>>
  let repository: Repository<UserEvent, Result<ResultedRepositoryResult, Error>, Result<UserState, Error>>

  const createCommand = CreateUser(randomUUID(), { name: 'Elon', email: 'elon@x.com' })

  beforeEach(() => {
    database = new ResultedDatabase()
    eventStore = new ResultedEventStore(database)
    repository = new ResultedRepository(eventStore, streamName, User.evolve, User.initialState)
  })

  it('should be defined', () => {
    expect(ResultedRepository).toBeDefined()
  })

  it('should store the decider user event', async () => {
    const pastEvents: UserEvent[] = []
    const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

    const events = User.decide(createCommand, currentState)
    const result = await repository.store(events)
    expect(result.isOk()).toBe(true)
    expect(result.unwrap()).toStrictEqual({ id: createCommand.aggregateId })
  })
  it('should load the current user state', async () => {
    const pastEvents: UserEvent[] = []
    const currentState = pastEvents.reduce(User.evolve, User.initialState(createCommand.aggregateId))

    const events = User.decide(createCommand, currentState)
    await repository.store(events)
    const userStateResult = await repository.load(createCommand.aggregateId)
    expect(userStateResult.isOk()).toBe(true)
    expect(userStateResult.unwrap()).toStrictEqual({
      ...events[0].payload,
      id: createCommand.aggregateId,
    })
  })
})
