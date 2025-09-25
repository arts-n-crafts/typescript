import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventProducer<TEvent extends BaseEvent, TReturnType = Promise<void>> {
  publish(stream: string, anEvent: TEvent): TReturnType
}

export interface EventConsumer<
  TEvent extends BaseEvent,
  TEventHandler = EventHandler<TEvent>,
  TConsumeReturnType = Promise<void>,
  TSubscribeReturnType = void,
> {
  subscribe(stream: string, handler: TEventHandler): TSubscribeReturnType
  consume(stream: string, anEvent: TEvent): TConsumeReturnType
}
