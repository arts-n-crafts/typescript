import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventHandler<TEvent extends BaseEvent<TEvent['payload']>> {
  handle: (anEvent: TEvent) => Promise<void>
}
