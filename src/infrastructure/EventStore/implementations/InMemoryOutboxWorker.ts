import type { BaseEvent } from '@domain/BaseEvent.js'
import type { EventBus } from '@infrastructure/EventBus/EventBus.js'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import type { OutboxWorker } from '@infrastructure/EventStore/OutboxWorker.js'

export class InMemoryOutboxWorker implements OutboxWorker {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: EventBus<BaseEvent<unknown>>,
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
