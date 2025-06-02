import type { UserCreatedPayload } from '../../domain/DomainEvent/examples/UserCreated'
import type { IEventStore } from '../EventStore/IEventStore'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '../../domain/DomainEvent/examples/UserCreated'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { EventBus } from './EventBus'
import { UserCreatedEventHandler } from './examples/UserCreatedEventHandler'

describe('eventBus', () => {
  let eventBus: EventBus
  let eventStore: IEventStore
  let handler: UserCreatedEventHandler
  let aggregateId: string
  let payload: UserCreatedPayload

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    handler = new UserCreatedEventHandler(eventStore)
    aggregateId = randomUUID()
    payload = { name: 'test', email: 'musk@x.com', prospect: true }
  })

  it('should be defined', () => {
    expect(EventBus).toBeDefined()
  })

  it('should be able subscribe to events', () => {
    eventBus.subscribe(handler)
  })

  it('should be able publish events', async () => {
    eventBus.subscribe(handler)
    const createdEvent = UserCreated(aggregateId, 1, payload)
    await eventBus.publish(createdEvent)

    const events = await eventStore.loadEvents(aggregateId)
    const sentEventCausedByCreatedEventIndex = events.findIndex(event => event.metadata.causationId === createdEvent.id)
    expect(sentEventCausedByCreatedEventIndex !== -1).toBeTruthy()
    expect(events[sentEventCausedByCreatedEventIndex].type).toBe('UserRegistrationEmailSent')
  })
})
