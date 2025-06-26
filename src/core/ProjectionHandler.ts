import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface ProjectionHandler<TEvent extends BaseEvent<TEvent['payload']>> extends EventHandler<TEvent> {
  start: () => void
  handle: (anEvent: TEvent) => Promise<void>
}
