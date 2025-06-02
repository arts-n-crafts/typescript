import type { BaseEvent } from '../EventBus/BaseEvent'
import type { IEventHandler } from '../EventBus/IEventHandler'

export interface IProjectionHandler<TEvent extends BaseEvent = BaseEvent> extends IEventHandler<TEvent> {
  start: () => void
  handle: (anEvent: TEvent) => Promise<void>
}
