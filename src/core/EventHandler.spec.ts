import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { UserRegistrationEmailSentPayload } from '@domain/examples/UserRegistrationEmailSent.ts'
import { randomUUID } from 'node:crypto'
import { ContractSignedHandler } from '@core/examples/ContractSignedHandler.ts'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryEventBus } from '@infrastructure/EventBus/implementations/InMemoryEventBus.js'
import { InMemoryEventStore } from '@infrastructure/EventStore/implementations/InMemoryEventStore.js'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.js'

describe('eventHandler', () => {
  const eventBus = new InMemoryEventBus()
  const eventStore = new InMemoryEventStore()
  const repository = new UserRepository(eventStore, eventBus)
  const handler = new UserCreatedEventHandler(repository)

  it('should be defined', () => {
    expect(ContractSignedHandler).toBeDefined()
  })

  it('should process the MockUserCreated event and dispatch the MockUserRegistrationEmailSentEvent', async () => {
    const event = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await handler.handle(event)
    const events = await repository.load(event.aggregateId)
    const sentEvent = events[0] as unknown as DomainEvent<UserRegistrationEmailSentPayload>
    expect(sentEvent.type).toBe('UserRegistrationEmailSent')
    expect(sentEvent.payload.status).toBe('SUCCESS')
  })
})
