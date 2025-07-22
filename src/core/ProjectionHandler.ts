import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface ProjectionHandler<TEvent extends BaseEvent, TResult = void> extends EventHandler<TEvent, TResult> {
  start: () => void
  handle: (anEvent: TEvent) => Promise<TResult>
}
