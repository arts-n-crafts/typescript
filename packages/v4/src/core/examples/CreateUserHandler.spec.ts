import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { User } from '@domain/examples/User.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateUserHandler } from './CreateUserHandler.ts'

describe('createUserHandler', () => {
  const aggregateId = randomUUID()
  let outbox: InMemoryOutbox
  let handler: CreateUserHandler

  beforeEach(() => {
    const database = new SimpleDatabase<StoredEvent<UserEvent>>()
    outbox = new InMemoryOutbox()
    const eventStore = new SimpleEventStore<UserEvent>(database, outbox)
    const repository = new SimpleRepository<UserState, UserEvent, UserEvent>(eventStore, 'users', User.evolve, User.initialState)
    handler = new CreateUserHandler(repository, outbox)
  })

  it('should store a UserCreated event when user does not exist', async () => {
    const command = createRegisterUserCommand(aggregateId, { name: 'Elon', email: 'elon@boring.com' })
    await handler.execute(command)
    const pending = await outbox.getPending()
    expect(pending).toHaveLength(1)
    expect(pending[0].event.type).toBe('UserCreated')
    expect(pending[0].event.metadata.outcome).toBe('accepted')
  })

  it('should enqueue a rejection when user already exists', async () => {
    const command = createRegisterUserCommand(aggregateId, { name: 'Elon', email: 'elon@boring.com' })
    await handler.execute(command)
    const first = await outbox.getPending()
    await outbox.markAsPublished(first[0].id)

    await handler.execute(command)
    const pending = await outbox.getPending()
    expect(pending).toHaveLength(1)
    expect(pending[0].event.metadata.outcome).toBe('rejected')
    expect((pending[0].event.payload as { reasonCode: string }).reasonCode).toBe('ALREADY_EXISTS')
  })

  it('should not store an event when a rejection occurs', async () => {
    const command = createRegisterUserCommand(aggregateId, { name: 'Elon', email: 'elon@boring.com' })
    await handler.execute(command)
    await handler.execute(command)
    const pending = await outbox.getPending()
    const accepted = pending.filter(e => e.event.metadata.outcome === 'accepted')
    expect(accepted).toHaveLength(1)
  })
})
