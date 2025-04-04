import type { Event } from './Event'

export abstract class EventHandler<TEvent extends Event> {
  abstract handle(event: TEvent): Promise<void>
}
