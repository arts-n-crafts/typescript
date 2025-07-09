import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { EventBus } from '../EventBus.ts'

export class InMemoryEventBus<TEvent extends BaseEvent<TEvent['payload']>> implements EventBus<TEvent> {
  private handlers: Map<BaseEvent<unknown>['type'], EventHandler<any>[]> = new Map()

  subscribe<TSpecificEvent extends TEvent>(
    anEventType: TSpecificEvent['type'],
    aHandler: EventHandler<TSpecificEvent>,
  ): void {
    const handlersForType = this.handlers.get(anEventType) ?? []
    this.handlers.set(anEventType, [...handlersForType, aHandler])
  }

  async publish<TSpecificEvent extends TEvent>(anEvent: TSpecificEvent): Promise<void> {
    const handlersForType = this.handlers.get(anEvent.type) ?? []
    await Promise.all(
      handlersForType.map(async handler => handler.handle(anEvent)),
    )
  }
}
