import type { DomainEvent } from '../../domain'
import type { Event } from '../EventBus/Event'
import type { EventBus } from '../EventBus/EventBus'

export abstract class EventStore {
  constructor(
    protected readonly eventBus: EventBus,
  ) {}

  abstract store(event: Event): Promise<void>
  abstract loadEvents(aggregateId: string): Promise<DomainEvent[]>
}
