import type { BaseEvent } from '@domain/BaseEvent.js'
import type { InMemoryEventBus } from '@infrastructure/EventBus/implementations/InMemoryEventBus.js'
import type { InMemoryEventStore } from '@infrastructure/EventStore/implementations/InMemoryEventStore.js'
import type { OutboxWorker } from '@infrastructure/EventStore/OutboxWorker.js'

export class InMemoryOutboxWorker implements OutboxWorker {
  constructor(
    private readonly eventStore: InMemoryEventStore,
    private readonly eventBus: InMemoryEventBus<BaseEvent<unknown>>,
  ) {}

  async tick(): Promise<void> {
    const entries = this.eventStore.getOutboxBatch()
    for (const entry of entries) {
      await this.eventBus.publish(entry.event)
      this.eventStore.acknowledgeDispatch(entry.id)
    }
    await new Promise(res => setTimeout(res, 10))
  }
}
