import type { BaseEvent } from './Event'
import type { EventHandler } from './EventHandler'

export class EventBus {
  private handlers: Array<EventHandler<BaseEvent>> = []

  subscribe(handler: EventHandler<BaseEvent>): void {
    this.handlers.push(handler)
  }

  async publish(event: BaseEvent): Promise<void> {
    await Promise.all(
      this.handlers.map(
        async handler => handler.handle(event),
      ),
    )
  }
}
