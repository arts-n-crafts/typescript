import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'

interface Handling<TEvent extends BaseEvent, TReturnType = Promise<void>> {
  handle(anEvent: TEvent): TReturnType
}

interface Startable {
  start(eventBus: EventBus<BaseEvent>): void
}

export interface EventHandler<TEvent extends BaseEvent, TReturnType = Promise<void>>
  extends Handling<TEvent, TReturnType>, Startable
{}
