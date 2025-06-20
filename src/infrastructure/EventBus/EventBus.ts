import type { EventHandler } from '../../core'

export interface EventBus<TEvent> {
  subscribe: (aHandler: EventHandler) => void
  publish: (anEvent: TEvent) => Promise<void>
}
