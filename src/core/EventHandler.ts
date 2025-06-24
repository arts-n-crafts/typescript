import type { BaseEvent } from '../domain/BaseEvent'

export interface EventHandler<TEvent = BaseEvent> {
  handle: (anEvent: TEvent) => Promise<void>
}
