import type { EventHandler } from '@core/EventHandler.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'

export interface EventProducer<TEvent extends DomainEvent | IntegrationEvent | ExternalEvent, TReturnType = Promise<void>> {
  publish(stream: string, anEvent: TEvent): TReturnType
}

export interface EventConsumer<
  TEvent extends DomainEvent | IntegrationEvent | ExternalEvent,
  TEventHandler = EventHandler<TEvent>,
  TConsumeReturnType = Promise<void>,
  TSubscribeReturnType = void,
> {
  subscribe(stream: string, handler: TEventHandler): TSubscribeReturnType
  consume(stream: string, anEvent: TEvent): TConsumeReturnType
}
