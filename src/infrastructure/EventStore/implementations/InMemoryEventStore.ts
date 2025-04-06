import type { DomainEvent } from '../../../domain'
import type { BaseEvent } from '../../EventBus/Event'
import { isDomainEvent } from '../../../domain/DomainEvent/utils/isDomainEvent'
import { EventStore } from '../EventStore'

export class InMemoryEventStore extends EventStore {
  private events: BaseEvent[] = []

  async store(event: BaseEvent): Promise<void> {
    this.events.push(event)
    await this.eventBus.publish(event)
  }

  async loadEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.events.filter(event => isDomainEvent(event) && event.aggregateId === aggregateId) as DomainEvent[]
  }
}
