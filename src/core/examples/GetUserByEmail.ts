import type { Query, QueryMetadata } from '@core/Query.ts'
import { createQuery } from '@core/utils/createQuery.ts'

export interface GetUserByEmailProps {
  email: string
}

export function createGetUserByEmailQuery(payload: GetUserByEmailProps, metadata?: Partial<QueryMetadata>): Query<'GetUserByEmail', GetUserByEmailProps> {
  return createQuery('GetUserByEmail', payload, metadata)
}

export type GetUserByEmail = ReturnType<typeof createGetUserByEmailQuery>
