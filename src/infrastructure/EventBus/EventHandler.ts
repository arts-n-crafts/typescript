import type { BaseEvent } from './Event'

export abstract class EventHandler<TEvent extends BaseEvent> {
  abstract handle(event: TEvent): Promise<void>
}
