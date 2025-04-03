import type { DomainEvent } from '../../domain'
import type { EventHandler } from './EventHandler'

export class EventBus {
  private handlers: Array<EventHandler<DomainEvent<unknown>>> = []

  subscribe(handler: EventHandler<DomainEvent<unknown>>): void {
    this.handlers.push(handler)
  }

  async publish(event: DomainEvent<unknown>): Promise<void> {
    await Promise.all(
      this.handlers.map(
        async handler => handler.handle(event),
      ),
    )
  }
}
