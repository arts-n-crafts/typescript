import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventHandler<TEvent extends BaseEvent, TResult = void> {
  handle: (anEvent: TEvent) => Promise<TResult>
}
