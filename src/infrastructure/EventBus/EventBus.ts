import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

interface Subscribing<TEvent extends BaseEvent, TReturnType = void> {
  subscribe(anEventType: TEvent['type'], aHandler: EventHandler<TEvent>): TReturnType
}

interface Publishing<TEvent extends BaseEvent, TReturnType = Promise<void>> {
  publish(anEvent: TEvent): TReturnType
}

export interface EventBus<TEvent extends BaseEvent, TPublisherReturnType = Promise<void>, TSubscriberReturnType = void>
  extends
  Subscribing<TEvent, TSubscriberReturnType>,
  Publishing<TEvent, TPublisherReturnType>
{ }
