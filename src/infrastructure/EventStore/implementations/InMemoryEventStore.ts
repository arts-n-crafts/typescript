import type { EventBus } from '../../EventBus/EventBus'
import type { EventStore } from '../EventStore'
import { isDomainEvent } from '../../../domain'

export class InMemoryEventStore<TEvent> implements EventStore<TEvent> {
  private events: TEvent[] = []

  constructor(
    protected readonly eventBus: EventBus<TEvent>,
  ) {
  }

  async store(event: TEvent): Promise<void> {
    this.events = [...this.events, event]
    await this.eventBus.publish(event)
  }

  async loadEvents(aggregateId: string): Promise<TEvent[]> {
    return this.events.filter(event => isDomainEvent(event) && event.aggregateId === aggregateId)
  }
}
