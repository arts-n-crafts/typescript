import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { UserRegistrationEmailSentPayload } from '@domain/examples/UserRegistrationEmailSent.ts'
import { randomUUID } from 'node:crypto'
import { ContractSignedHandler } from '@core/examples/ContractSignedHandler.ts'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { User } from '@domain/examples/User.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { makeStreamKey } from '@utils/streamKey/index.ts'

describe('eventHandler', () => {
  const database = new InMemoryDatabase()
  const eventStore = new EventStore(database)
  const repository = new UserRepository(eventStore, 'users', User.evolve, User.initialState)
  const handler = new UserCreatedEventHandler(repository)

  it('should be defined', () => {
    expect(ContractSignedHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await handler.handle(event)
    await repository.load(event.aggregateId)

    const events = await eventStore.load(
      makeStreamKey('users', event.aggregateId),
    )
    const sentEvent = events[0] as DomainEvent<UserRegistrationEmailSentPayload>
    expect(sentEvent.type).toBe('UserRegistrationEmailSent')
    expect(sentEvent.payload.status).toBe('SUCCESS')
  })
})
