import type { BaseEvent } from './BaseEvent'

export interface IEventHandler<TEvent = BaseEvent> {
  handle: (anEvent: TEvent) => Promise<void>
}
