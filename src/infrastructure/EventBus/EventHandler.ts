import type { BaseEvent } from './BaseEvent'

export abstract class EventHandler<TEvent extends BaseEvent> {
  abstract handle(event: TEvent): Promise<void>
}
