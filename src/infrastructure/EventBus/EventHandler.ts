import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'

export abstract class EventHandler<TEvent extends DomainEvent<unknown>> {
  abstract handle(event: TEvent): Promise<void>
}
