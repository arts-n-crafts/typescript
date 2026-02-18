import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { createUpdateNameOfUserCommand } from '@core/examples/UpdateUserName.ts'
import { User } from '@domain/examples/User.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateUserHandler } from './CreateUserHandler.ts'
import { UpdateUserNameHandler } from './UpdateUserNameHandler.ts'

describe('updateUserNameHandler', () => {
  const aggregateId = randomUUID()
  let outbox: InMemoryOutbox
  let createHandler: CreateUserHandler
  let updateHandler: UpdateUserNameHandler

  beforeEach(async () => {
    const database = new SimpleDatabase<StoredEvent<UserEvent>>()
    outbox = new InMemoryOutbox()
    const eventStore = new SimpleEventStore<UserEvent>(database, outbox)
    const repository = new SimpleRepository<UserState, UserEvent, UserEvent>(eventStore, 'users', User.evolve, User.initialState)
    createHandler = new CreateUserHandler(repository, outbox)
    updateHandler = new UpdateUserNameHandler(repository, outbox)

    await createHandler.execute(createRegisterUserCommand(aggregateId, { name: 'Elon', email: 'elon@boring.com' }))
    const pending = await outbox.getPending()
    await outbox.markAsPublished(pending[0].id)
  })

  it('should store a UserNameUpdated event when name changes', async () => {
    await updateHandler.execute(createUpdateNameOfUserCommand(aggregateId, { name: 'Donald' }))
    const pending = await outbox.getPending()
    expect(pending).toHaveLength(1)
    expect(pending[0].event.type).toBe('UserNameUpdated')
    expect(pending[0].event.metadata.outcome).toBe('accepted')
  })

  it('should store no event when name is unchanged', async () => {
    await updateHandler.execute(createUpdateNameOfUserCommand(aggregateId, { name: 'Elon' }))
    const pending = await outbox.getPending()
    expect(pending).toHaveLength(0)
  })
})
