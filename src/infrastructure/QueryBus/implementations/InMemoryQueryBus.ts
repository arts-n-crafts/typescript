import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { QueryBus } from '../QueryBus.ts'

export class InMemoryQueryBus implements QueryBus {
  private handlers: Map<string, QueryHandler> = new Map()

  register<TType = string, TPayload = unknown>(
    aTypeOfQuery: string,
    anHandler: QueryHandler<TType, TPayload>,
  ): void {
    if (this.handlers.has(aTypeOfQuery)) {
      throw new Error(`Handler already registered for query type: ${aTypeOfQuery}`)
    }
    this.handlers.set(aTypeOfQuery, anHandler as QueryHandler)
  }

  async execute<TReturnType = unknown>(aQuery: Query): Promise<TReturnType> {
    const handler = this.handlers.get(aQuery.type)
    if (!handler) {
      throw new Error(`No handler found for query type: ${aQuery.type}`)
    }
    return handler.execute(aQuery) as TReturnType
  }
}
