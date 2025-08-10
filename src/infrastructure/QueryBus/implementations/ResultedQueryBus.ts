import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { Result } from 'oxide.ts'
import type { QueryBus } from '../QueryBus.ts'
import { Err, Ok } from 'oxide.ts'

export class ResultedQueryBus<TQuery extends Query, TProjection>
implements QueryBus<TQuery, Result<TProjection, Error>, Result<void, Error>> {
  private handlers: Map<TQuery['type'], QueryHandler<TQuery, TProjection>> = new Map()

  register(aTypeOfQuery: TQuery['type'], anHandler: QueryHandler<TQuery, TProjection>): Result<void, Error> {
    if (this.handlers.has(aTypeOfQuery)) {
      return Err(new Error(`Handler already registered for query type: ${aTypeOfQuery}`))
    }
    this.handlers.set(aTypeOfQuery, anHandler)
    return Ok(undefined)
  }

  async execute(aQuery: TQuery): Promise<Result<TProjection, Error>> {
    const handler = this.handlers.get(aQuery.type)
    if (!handler) {
      return Err(new Error(`No handler found for query type: ${aQuery.type}`))
    }
    const result = await handler.execute(aQuery)
    return Ok(result)
  }
}
