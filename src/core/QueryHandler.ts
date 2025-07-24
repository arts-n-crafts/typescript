import type { Query } from '@core/Query.ts'

export interface QueryHandler<TReturnType = unknown> {
  execute(aQuery: Query): Promise<TReturnType>
}
