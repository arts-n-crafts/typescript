import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { EventBus } from '../EventBus.ts'

export class InMemoryEventBus implements EventBus {
  private handlers = new Map<BaseEvent<unknown>['type'], EventHandler<BaseEvent<unknown>>[]>()

  subscribe<TEvent extends BaseEvent<TEvent['payload']>>(
    anEventType: TEvent['type'],
    aHandler: EventHandler<TEvent>,
  ): void {
    const handlersForType = this.handlers.get(anEventType) ?? []
    handlersForType.push(aHandler as EventHandler<BaseEvent<unknown>>)
    this.handlers.set(anEventType, handlersForType)
  }

  async publish<TEvent extends BaseEvent<TEvent['payload']>>(anEvent: TEvent): Promise<void> {
    const handlersForType = this.handlers.get(anEvent.type) ?? []
    await Promise.all(
      handlersForType.map(async handler => handler.handle(anEvent)),
    )
  }
}
