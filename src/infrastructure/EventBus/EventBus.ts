import type { BaseEvent } from './BaseEvent'
import type { IEventBus } from './IEventBus'
import type { IEventHandler } from './IEventHandler'

export class EventBus implements IEventBus {
  private handlers: Array<IEventHandler<any>> = []

  subscribe(handler: IEventHandler<any>): void {
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
