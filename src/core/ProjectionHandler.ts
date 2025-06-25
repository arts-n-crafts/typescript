import type { EventHandler } from '@core/EventHandler.ts'

export interface ProjectionHandler<TEvent> extends EventHandler<TEvent> {
  start: () => void
  handle: (anEvent: TEvent) => Promise<void>
}
