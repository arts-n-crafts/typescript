import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { Result } from 'oxide.ts'
import type { EventBus } from '../EventBus.ts'
import { Ok } from 'oxide.ts'

export class ResultedEventBus<TEvent extends BaseEvent> implements EventBus<TEvent, Promise<Result<void, never>>, Result<void, never>> {
  private handlers = new Map<TEvent['type'], EventHandler<TEvent>[]>()

  subscribe(
    anEventType: TEvent['type'],
    aHandler: EventHandler<TEvent>,
  ): Result<void, never> {
    const handlersForType = this.handlers.get(anEventType) ?? []
    handlersForType.push(aHandler)
    this.handlers.set(anEventType, handlersForType)
    return Ok(undefined)
  }

  async publish(anEvent: TEvent): Promise<Result<void, never>> {
    const handlersForType = this.handlers.get(anEvent.type) ?? []
    await Promise.all(
      handlersForType.map(async handler => handler.handle(anEvent)),
    )
    return Ok(undefined)
  }
}
