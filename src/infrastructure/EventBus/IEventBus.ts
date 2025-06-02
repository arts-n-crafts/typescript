import type { BaseEvent } from './BaseEvent'
import type { IEventHandler } from './IEventHandler'

export interface IEventBus {
  subscribe: (aHandler: IEventHandler<BaseEvent>) => void
  publish: (anEvent: BaseEvent) => Promise<void>
}
