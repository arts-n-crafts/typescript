import type { Query } from '@core/Query.ts'

export interface QueryHandler<TQuery extends Query, TProjection = Promise<unknown>> {
  execute(aQuery: TQuery): TProjection
}
