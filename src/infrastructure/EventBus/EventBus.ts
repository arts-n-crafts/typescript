import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

interface Subscribing<TEvent extends BaseEvent, TReturnType = void> {
  subscribe(anEventType: TEvent['type'], aHandler: EventHandler<TEvent>): TReturnType
}

interface Publishing<TEvent extends BaseEvent, TReturnType = void> {
  publish(anEvent: TEvent): Promise<TReturnType>
}

export interface EventBus<TEvent extends BaseEvent, TPublisherReturnType = void, TSubscriberReturnType = void>
  extends
  Subscribing<TEvent, TSubscriberReturnType>,
  Publishing<TEvent, TPublisherReturnType>
{ }
