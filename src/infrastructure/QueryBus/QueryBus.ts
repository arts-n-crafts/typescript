import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'

export interface QueryBus {
  register: (aQuery: string, anHandler: QueryHandler<any, any>) => void
  execute: (aQuery: Query) => Promise<unknown>
}
