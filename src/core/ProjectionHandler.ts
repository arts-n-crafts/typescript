import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface ProjectionHandler<TEvent extends BaseEvent, TReturnType = void> extends EventHandler<TEvent, TReturnType> {
  start(): void
  handle(anEvent: TEvent): Promise<TReturnType>
}
