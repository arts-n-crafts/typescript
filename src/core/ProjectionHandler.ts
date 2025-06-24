import type { EventHandler } from './EventHandler'

export interface ProjectionHandler<TEvent> extends EventHandler<TEvent> {
  start: () => void
  handle: (anEvent: TEvent) => Promise<void>
}
