import type { Event } from './Event'
import type { EventHandler } from './EventHandler'

export class EventBus {
  private handlers: Array<EventHandler<Event>> = []

  subscribe(handler: EventHandler<Event>): void {
    this.handlers.push(handler)
  }

  async publish(event: Event): Promise<void> {
    await Promise.all(
      this.handlers.map(
        async handler => handler.handle(event),
      ),
    )
  }
}
