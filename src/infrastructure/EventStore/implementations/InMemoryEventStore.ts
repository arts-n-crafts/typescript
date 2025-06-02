import type { DomainEvent } from '../../../domain'
import type { IEventBus } from '../../EventBus/IEventBus'
import type { IEventStore } from '../IEventStore'
import { isDomainEvent } from '../../../domain/DomainEvent/utils/isDomainEvent'

export class InMemoryEventStore implements IEventStore {
  private events: DomainEvent[] = []

  constructor(
    protected readonly eventBus: IEventBus,
  ) {}

  async store(event: DomainEvent): Promise<void> {
    this.events.push(event)
    await this.eventBus.publish(event)
  }

  async loadEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.events.filter(event => isDomainEvent(event) && event.aggregateId === aggregateId)
  }
}
