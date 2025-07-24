import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventBus {
  subscribe(anEventType: BaseEvent['type'], aHandler: EventHandler): void
  publish(anEvent: BaseEvent): Promise<void>
}
