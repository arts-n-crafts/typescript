import type { EventHandler } from '../../../core'
import type { EventBus } from '../EventBus.ts'

export class InMemoryEventBus<TEvent> implements EventBus<TEvent> {
  private handlers: Array<EventHandler<any>> = []

  subscribe<TEvent>(handler: EventHandler<TEvent>): void {
    this.handlers.push(handler)
  }

  async publish<TEvent>(event: TEvent): Promise<void> {
    await Promise.all(
      this.handlers.map(
        async handler => handler.handle(event),
      ),
    )
  }
}
