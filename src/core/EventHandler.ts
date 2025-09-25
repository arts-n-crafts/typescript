import type { BaseEvent } from '@domain/BaseEvent.ts'

interface Handling<TEvent extends BaseEvent, TReturnType> {
  handle(anEvent: TEvent): TReturnType
}

export interface EventHandler<TEvent extends BaseEvent, TReturnType = Promise<void>>
  extends Handling<TEvent, TReturnType>
{}
