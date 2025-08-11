import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { EventBus } from '../EventBus.ts'

export class SimpleEventBus<TEvent extends BaseEvent> implements EventBus<TEvent> {
  private handlers = new Map<TEvent['type'], EventHandler<TEvent>[]>()

  subscribe(
    anEventType: TEvent['type'],
    aHandler: EventHandler<TEvent>,
  ): void {
    const handlersForType = this.handlers.get(anEventType) ?? []
    handlersForType.push(aHandler)
    this.handlers.set(anEventType, handlersForType)
  }

  async publish(anEvent: TEvent): Promise<void> {
    const handlersForType = this.handlers.get(anEvent.type) ?? []
    await Promise.all(
      handlersForType.map(async handler => handler.handle(anEvent)),
    )
  }
}
