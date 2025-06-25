import type { EventHandler } from '@core/EventHandler.ts'

export interface EventBus<TEvent> {
  subscribe: (aHandler: EventHandler<TEvent>) => void
  publish: (anEvent: TEvent) => Promise<void>
}
