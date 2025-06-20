import type { Query } from '../domain'

export interface QueryHandler<TPayload = object, TResult = object> {
  execute: (aQuery: Query<TPayload>) => Promise<TResult>
}
