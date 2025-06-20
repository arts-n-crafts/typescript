import type { QueryHandler } from '../../core'
import type { Query } from '../../domain'

export interface QueryBus {
  register: (aQuery: string, anHandler: QueryHandler<any, any>) => void
  execute: (aQuery: Query) => Promise<unknown>
}
