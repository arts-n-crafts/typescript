import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface ProjectionHandler<TReturnType = void> extends EventHandler<TReturnType> {
  start(): void
  handle(anEvent: BaseEvent): Promise<TReturnType>
}
