import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'
import type { OutboxWorker } from '@infrastructure/Outbox/OutboxWorker.js'
import type { Outbox } from '../Outbox.ts'

export class InMemoryOutboxWorker implements OutboxWorker {
  constructor(
    private outbox: Outbox,
    private eventBus: EventBus,
  ) {}

  async runOnce(): Promise<void> {
    const pending = await this.outbox.getPending()

    await Promise.all(pending.map(async (entry) => {
      try {
        await this.eventBus.publish(entry.event)
        await this.outbox.markAsPublished(entry.id)
      }
      catch {
        await this.outbox.markAsFailed(entry.id)
      }
    }))
  }

  async tick(): Promise<void> {
    await this.runOnce()
  }

  start(intervalMs: number): void {
    setInterval(() => {
      void this.tick().catch(console.error)
    }, intervalMs)
  }
}
