import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'

interface Registerable<TQuery extends Query, TResult = void> {
  register(aTypeOfQuery: TQuery['type'], anHandler: QueryHandler<TQuery>): TResult
}

interface Executable<TQuery extends Query, TResult = Promise<unknown>> {
  execute(aQuery: TQuery): TResult
}

export interface QueryBus<TQuery extends Query, TExecutionResult, TRegisterResult = void>
  extends
  Executable<TQuery, TExecutionResult>,
  Registerable<TQuery, TRegisterResult>
{ }
