import type { Query } from '@core/Query.ts'

export interface QueryHandler<TQuery extends Query, TProjection = unknown> {
  execute(aQuery: TQuery): Promise<TProjection>
}
