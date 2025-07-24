import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'

export interface QueryBus {
  register(aTypeOfQuery: string, anHandler: QueryHandler): void
  execute(aQuery: Query): Promise<unknown>
}
