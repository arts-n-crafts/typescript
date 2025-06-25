import type { UserEvent } from '@domain/examples/User.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { EventStore } from '../EventStore/EventStore.ts'
import type { EventBus } from './EventBus.ts'
import { randomUUID } from 'node:crypto'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore.ts'
import { InMemoryEventBus } from './implementations/InMemoryEventBus.ts'

describe('eventBus', () => {
  let eventBus: EventBus<UserEvent>
  let eventStore: EventStore<UserEvent>
  let handler: UserCreatedEventHandler
  let aggregateId: string
  let payload: UserCreatedPayload

  beforeEach(() => {
    eventBus = new InMemoryEventBus<UserEvent>()
    eventStore = new InMemoryEventStore<UserEvent>(eventBus)
    handler = new UserCreatedEventHandler(eventStore)
    aggregateId = randomUUID()
    payload = { name: 'test', email: 'musk@x.com', prospect: true }
  })

  it('should be defined', () => {
    expect(InMemoryEventBus).toBeDefined()
  })

  it('should be able subscribe to events', () => {
    eventBus.subscribe(handler)
  })

  it('should be able publish events', async () => {
    eventBus.subscribe(handler)
    const createdEvent = UserCreated(aggregateId, payload)
    await eventBus.publish(createdEvent)

    const events = await eventStore.loadEvents(aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })
})
