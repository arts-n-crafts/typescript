import type { BaseEvent } from '@domain/BaseEvent.ts'

export interface EventHandler<TReturnType = void> {
  handle(anEvent: BaseEvent): Promise<TReturnType>
}
