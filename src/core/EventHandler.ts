import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventHandler<TEvent extends BaseEvent, TReturnType = void> {
  handle: (anEvent: TEvent) => Promise<TReturnType>
}
