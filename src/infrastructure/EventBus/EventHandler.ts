import type { DomainEvent } from '../../domain'

export abstract class EventHandler<TEvent extends DomainEvent<unknown>> {
  abstract handle(event: TEvent): Promise<void>
}
