import type { UserEvent } from '@domain/examples/User.js'
import type { Repository } from '@domain/Repository.js'
import type { AllEvents } from '@infrastructure/ScenarioTest/examples/User.module.ts'
import type { EventBus } from './EventBus.ts'
import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.js'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore.ts'
import { InMemoryEventBus } from './implementations/InMemoryEventBus.ts'

describe('eventBus', () => {
  let eventBus: EventBus<AllEvents>
  let eventStore: InMemoryEventStore
  let repository: Repository<UserEvent>

  beforeEach(() => {
    eventBus = new InMemoryEventBus<AllEvents>()
    eventStore = new InMemoryEventStore()
    repository = new UserRepository(eventStore, eventBus)
  })

  it('should be defined', () => {
    expect(InMemoryEventBus).toBeDefined()
  })

  it('should be able publish events', async () => {
    eventBus.subscribe('UserCreated', new UserCreatedEventHandler(repository))
    const createdEvent = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })
    await eventBus.publish(createdEvent)

    const events = await repository.load(createdEvent.aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })
})
