import type { Query } from '@core/Query.ts'

export interface QueryHandler<TType = string, TPayload = unknown> {
  execute: <TReturn = unknown>(aQuery: Query<TType, TPayload>) => Promise<TReturn[]>
}
