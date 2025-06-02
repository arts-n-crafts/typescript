import type { Query } from './Query'

export interface IQueryHandler<TPayload = object, TResult = object> {
  execute: (aQuery: Query<TPayload>) => Promise<TResult>
}
