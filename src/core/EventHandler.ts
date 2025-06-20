import type { BaseEvent } from '../domain/BaseEvent.ts'

export interface EventHandler<TEvent = BaseEvent> {
  handle: (anEvent: TEvent) => Promise<void>
}
