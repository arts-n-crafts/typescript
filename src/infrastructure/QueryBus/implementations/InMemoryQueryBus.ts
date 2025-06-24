import type { QueryHandler } from '../../../core'
import type { Query } from '../../../domain'
import type { QueryBus } from '../QueryBus'

export class InMemoryQueryBus implements QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map()

  register(
    aQuery: string,
    anHandler: QueryHandler<any, any>,
  ): void {
    if (this.handlers.has(aQuery)) {
      throw new Error(`Handler already registered for query type: ${aQuery}`)
    }
    this.handlers.set(aQuery, anHandler)
  }

  async execute<TResult>(aQuery: Query): Promise<TResult> {
    const handler = this.handlers.get(aQuery.type)
    if (!handler) {
      throw new Error(`No handler found for query type: ${aQuery.type}`)
    }
    return handler.execute(aQuery) as TResult
  }
}
