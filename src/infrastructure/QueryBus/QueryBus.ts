import type { QueryHandler } from '@core/QueryHandler.ts'
import type { Query } from '@domain/Query.ts'

export interface QueryBus {
  register: (aQuery: string, anHandler: QueryHandler<any, any>) => void
  execute: (aQuery: Query) => Promise<unknown>
}
