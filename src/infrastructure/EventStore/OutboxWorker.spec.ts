import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.js'
import { InMemoryEventBus } from '@infrastructure/EventBus/implementations/InMemoryEventBus.js'
import { InMemoryEventStore } from '@infrastructure/EventStore/implementations/InMemoryEventStore.js'
import { InMemoryOutboxWorker } from '@infrastructure/EventStore/implementations/InMemoryOutboxWorker.js'

describe('outbox worker', () => {
  it('should be defined', () => {
    expect(InMemoryOutboxWorker).toBeDefined()
  })

  it('background worker publishes and acknowledges events', async () => {
    const eventBus = new InMemoryEventBus()
    const eventStore = new InMemoryEventStore()
    const worker = new InMemoryOutboxWorker(eventStore, eventBus)

    const event = UserCreated(randomUUID(), { name: 'test', email: 'musk@x.com' })

    await eventStore.append('users', [event])

    expect(eventStore.getOutboxBatch()).toHaveLength(1)
    await worker.tick()
    expect(eventStore.getOutboxBatch()).toHaveLength(0)
  })
})
