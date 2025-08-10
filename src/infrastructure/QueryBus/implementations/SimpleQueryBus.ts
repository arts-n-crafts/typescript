import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { QueryBus } from '../QueryBus.ts'

export class SimpleQueryBus<TQuery extends Query, TProjection>
implements QueryBus<TQuery, TProjection> {
  private handlers: Map<TQuery['type'], QueryHandler<TQuery, TProjection>> = new Map()

  register(
    aTypeOfQuery: TQuery['type'],
    anHandler: QueryHandler<TQuery, TProjection>,
  ): void {
    if (this.handlers.has(aTypeOfQuery)) {
      throw new Error(`Handler already registered for query type: ${aTypeOfQuery}`)
    }
    this.handlers.set(aTypeOfQuery, anHandler)
  }

  async execute(aQuery: TQuery): Promise<TProjection> {
    const handler = this.handlers.get(aQuery.type)
    if (!handler) {
      throw new Error(`No handler found for query type: ${aQuery.type}`)
    }
    return handler.execute(aQuery)
  }
}
