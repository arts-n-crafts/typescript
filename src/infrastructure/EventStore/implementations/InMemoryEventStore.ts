import type { DomainEvent } from '../../../domain/DomainEvent/DomainEvent'
import { EventStore } from '../EventStore'

export class InMemoryEventStore extends EventStore {
  private events: Record<string, DomainEvent<unknown>[]> = {}

  async store(event: DomainEvent<unknown>): Promise<void> {
    const key = event.aggregateId
    if (!(key in this.events)) {
      this.events[key] = []
    }
    this.events[key].push(event)
    await this.eventBus.publish(event)
  }

  async loadEvents(aggregateId: string): Promise<DomainEvent<unknown>[]> {
    const events = this.events[aggregateId]
    return [...(Array.isArray(events) ? events : [])]
  }
}
