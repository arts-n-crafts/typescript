import type { IQueryHandler } from './IQueryHandler'
import type { Query } from './Query'

export interface IQueryBus {
  register: (aQuery: string, anHandler: IQueryHandler<any, any>) => void
  execute: (aQuery: Query) => Promise<unknown>
}
