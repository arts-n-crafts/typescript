import type { Database } from '../Database/Database'
import type { Query } from './Query'

export abstract class QueryHandler<TQuery extends Query, TResult> {
  constructor(
    protected database: Database,
  ) { }

  abstract execute(query: TQuery): Promise<TResult>
}
