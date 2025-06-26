import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { EventBus } from '../../EventBus/EventBus.ts'
import type { EventStore } from '../EventStore.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'

export class InMemoryEventStore<TEvent extends DomainEvent<TEvent['payload']>> implements EventStore<TEvent> {
  private events: TEvent[] = []

  constructor(
    protected readonly eventBus: EventBus<BaseEvent<any>>,
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
