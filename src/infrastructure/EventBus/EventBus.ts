import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventBus {
  subscribe<TEvent extends BaseEvent>(anEventType: TEvent['type'], aHandler: EventHandler<TEvent>): void
  publish<TEvent extends BaseEvent>(anEvent: TEvent): Promise<void>
}
