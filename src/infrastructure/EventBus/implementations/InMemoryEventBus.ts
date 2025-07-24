import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { EventBus } from '../EventBus.ts'

export class InMemoryEventBus implements EventBus {
  private handlers = new Map<BaseEvent['type'], EventHandler[]>()

  subscribe(
    anEventType: BaseEvent['type'],
    aHandler: EventHandler,
  ): void {
    const handlersForType = this.handlers.get(anEventType) ?? []
    handlersForType.push(aHandler)
    this.handlers.set(anEventType, handlersForType)
  }

  async publish(anEvent: BaseEvent): Promise<void> {
    const handlersForType = this.handlers.get(anEvent.type) ?? []
    await Promise.all(
      handlersForType.map(async handler => handler.handle(anEvent)),
    )
  }
}
