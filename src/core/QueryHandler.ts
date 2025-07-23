import type { Query } from '@core/Query.ts'

export interface QueryHandler<TType = string, TPayload = unknown> {
  execute: <TReturnType = unknown>(aQuery: Query<TType, TPayload>) => Promise<TReturnType[]>
}
