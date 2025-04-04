import type { DomainEvent } from '../../domain/DomainEvent_v1/DomainEvent'
import type { EventBus } from '../EventBus/EventBus'

export abstract class EventStore {
  constructor(
    protected readonly eventBus: EventBus,
  ) {}

  abstract store(event: DomainEvent<unknown>): Promise<void>
  abstract loadEvents<TProps>(aggregateId: string): Promise<DomainEvent<TProps>[]>
}
