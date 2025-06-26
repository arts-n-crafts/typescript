import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventBus<TEvent extends BaseEvent<TEvent['payload']>> {
  subscribe: <TSpecificEvent extends TEvent>(anEventType: TSpecificEvent['type'], aHandler: EventHandler<TSpecificEvent>) => void
  publish: (anEvent: TEvent) => Promise<void>
}
