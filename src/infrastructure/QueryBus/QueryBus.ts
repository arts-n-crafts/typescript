import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'

export interface QueryBus {
  register: <TType = string, TPayload = unknown>(aTypeOfQuery: string, anHandler: QueryHandler<TType, TPayload>) => void
  execute: (aQuery: Query) => Promise<ReturnType<QueryHandler['execute']>>
}
