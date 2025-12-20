import type { EventHandler } from '@core/EventHandler.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import type { EventConsumer, EventProducer } from '../EventBus.ts'

export class SimpleEventBus<TEvent extends DomainEvent | IntegrationEvent | ExternalEvent>
implements EventConsumer<TEvent>, EventProducer<TEvent> {
  private handlers = new Map<string, EventHandler<TEvent>[]>()

  subscribe(
    stream: string,
    aHandler: EventHandler<TEvent>,
  ): void {
    const handlersForType = this.handlers.get(stream) ?? []
    handlersForType.push(aHandler)
    this.handlers.set(stream, handlersForType)
  }

  async consume(stream: string, anEvent: TEvent): Promise<void> {
    if (!this.handlers.has(stream))
      return
    const handlers = this.handlers.get(stream) as EventHandler<TEvent>[]
    await Promise.all(handlers.map(async (handler) => {
      return handler.handle(anEvent)
    }))
  }

  async publish(stream: string, anEvent: TEvent): Promise<void> {
    await this.consume(stream, anEvent)
  }
}
