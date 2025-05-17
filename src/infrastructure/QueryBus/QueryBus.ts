import type { Query } from './Query'
import type { QueryHandler } from './QueryHandler'

export interface IQueryBus {
  register: <TPayload, TResult>(
    aQuery: string,
    anHandler: QueryHandler<Query<TPayload>, TResult>
  ) => void
  execute: (aQuery: Query<unknown>) => Promise<unknown>
}

export class QueryBus implements IQueryBus {
  private handlers: Map<string, QueryHandler<Query<unknown>, unknown>> = new Map()

  register<TPayload, TResult>(
    aQuery: string,
    anHandler: QueryHandler<Query<TPayload>, TResult>,
  ): void {
    if (this.handlers.has(aQuery)) {
      throw new Error(`Handler already registered for query type: ${aQuery}`)
    }
    this.handlers.set(aQuery, anHandler)
  }

  async execute<TResult>(aQuery: Query<unknown>): Promise<TResult> {
    const handler = this.handlers.get(aQuery.type)
    if (!handler) {
      throw new Error(`No handler found for query type: ${aQuery.type}`)
    }
    return handler.execute(aQuery) as TResult
  }
}
