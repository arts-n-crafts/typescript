import type { Query } from '@domain/Query.ts'

export interface QueryHandler<TPayload = object, TResult = object> {
  execute: (aQuery: Query<TPayload>) => Promise<TResult>
}
