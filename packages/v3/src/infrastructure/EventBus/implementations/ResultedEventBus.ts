import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { EventConsumer, EventProducer } from '@infrastructure/EventBus/EventBus.js'
import { Err, Ok, Result } from 'oxide.ts'

export class ResultedEventBus<TEvent extends BaseEvent>
implements EventConsumer<TEvent, EventHandler<TEvent>, Promise<Result<void, Error>>, Result<void, never>>,
        EventProducer<TEvent, Promise<Result<void, Error>>> {
  private handlers = new Map<string, EventHandler<TEvent>[]>()

  async consume(stream: string, anEvent: TEvent): Promise<Result<void, Error>> {
    if (!this.handlers.has(stream))
      return Ok(undefined)
    const handlers = this.handlers.get(stream) as EventHandler<TEvent>[]
    const results = await Promise.all(
      handlers.map(
        async (handler) => {
          return Result.safe(handler.handle(anEvent))
        },
      ),
    )
    const errs = results.reduce((previousValue, currentValue) => {
      const [err] = currentValue.intoTuple()
      if (err)
        previousValue.push(err)
      return previousValue
    }, [] as Error[])
    if (errs.length)
      return Err(new AggregateError(errs, 'EventBus::consume > return errors'))
    return Ok(undefined)
  }

  subscribe(
    stream: string,
    aHandler: EventHandler<TEvent>,
  ): Result<void, never> {
    const handlersForType = this.handlers.get(stream) ?? []
    handlersForType.push(aHandler)
    this.handlers.set(stream, handlersForType)
    return Ok(undefined)
  }

  async publish(stream: string, anEvent: TEvent): Promise<Result<void, Error>> {
    await this.consume(stream, anEvent)
    return Ok(undefined)
  }
}
