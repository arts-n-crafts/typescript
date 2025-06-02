import type { IQueryBus } from './IQueryBus'
import type { IQueryHandler } from './IQueryHandler'
import type { Query } from './Query'

export class QueryBus implements IQueryBus {
  private handlers: Map<string, IQueryHandler<any, any>> = new Map()

  register(
    aQuery: string,
    anHandler: IQueryHandler<any, any>,
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
